import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import assert from "assert";
import {JsonRpcProvider} from "@ethersproject/providers";
import {Contract, ContractFactory, Wallet} from "ethers";
import {getContractFactory} from "@eth-optimism/contracts";

import * as JunkCoinERC20 from "../artifacts/contracts/JunkCoinERC20.sol/JunkCoinERC20.json";
import * as JunkCoinDepositedERC20 from '../artifacts-ovm/contracts/JunkCoinDepositedERC20.sol/JunkCoinDepositedERC20.json';
import * as Junkeng from '../artifacts-ovm/contracts/Junkeng.sol/Junkeng.json';
import {TransactionResponse} from "@ethersproject/abstract-provider";


const deployL1JuncCoinERC20 = async (l1Wallet: Wallet): Promise<Contract> => {
    // Deploy L1 contracts
    const L1JunkCoinERC20Factory = new ContractFactory(JunkCoinERC20.abi, JunkCoinERC20.bytecode, l1Wallet);
    const L1JunkCoinERC20 = await L1JunkCoinERC20Factory.deploy(
        "JunkCoin",
        "JKC",
        100000000,
    )
    await L1JunkCoinERC20.deployTransaction.wait();
    console.log('(L1)JunkCoinERC20: ' + L1JunkCoinERC20.address);

    return L1JunkCoinERC20;
}

const deployL1ERC20Gateway = async (
    L1MessengerAddress: string,
    L1JunkCoinERC20Address: string,
    L2JunkCoinDepositedERC20Address:
    string, l1Wallet: Wallet
): Promise<Contract> => {
    // Deploy L1 contracts
    const L1ERC20GatewayFactory = getContractFactory('OVM_L1ERC20Gateway');
    const L1ERC20Gateway = await L1ERC20GatewayFactory.connect(l1Wallet).deploy(
        L1JunkCoinERC20Address,
        L2JunkCoinDepositedERC20Address,
        L1MessengerAddress,
    )
    await L1ERC20Gateway.deployTransaction.wait();
    console.log('(L1)OVM_L1ERC20Gateway: ' + L1ERC20Gateway.address);

    return L1ERC20Gateway;
}

// Deposit full balance of token
const depositL1JunkCoinERC20 = async (L1JunkCoinERC20: Contract, L1ERC20Gateway: Contract) => {
    await L1JunkCoinERC20.increaseAllowance(L1ERC20Gateway.address, 100000000, { gasLimit: 1000000 })
        .then((tx: TransactionResponse) => tx.wait());
    await L1ERC20Gateway.deposit(100000000, { gasLimit: 1000000 })
        .then((tx: TransactionResponse) => tx.wait());
    console.log('(L1)JunkCoinERC20 has been deposited.');
}


const deploy: DeployFunction = async function ({
    getNamedAccounts,
    deployments,
    getChainId,
    getUnnamedAccounts
}: HardhatRuntimeEnvironment) {
    assert(process.env.WALLET_PRIVATE_KEY_DEPLOYER);
    assert(process.env.L1_WEB3_URL);
    assert(process.env.L1_MESSENGER_ADDRESS);
    assert(process.env.L2_MESSENGER_ADDRESS);

    const { deploy, execute, save } = deployments;
    const { deployer } = await getNamedAccounts();

    const l1Provider = new JsonRpcProvider(process.env.L1_WEB3_URL);
    const l1Wallet = new Wallet(process.env.WALLET_PRIVATE_KEY_DEPLOYER, l1Provider);

    const L1JunkCoinERC20 = await deployL1JuncCoinERC20(l1Wallet);

    const L2JunkCoinDepositedERC20 = await deploy("JunkCoinDepositedERC20", {
        from: deployer,
        gasLimit: 8000000,
        args: [process.env.L2_MESSENGER_ADDRESS, "JunkCoin", "JKC"],
        contract: {
            abi: JunkCoinDepositedERC20.abi,
            bytecode: JunkCoinDepositedERC20.bytecode,
            deployedBytecode: JunkCoinDepositedERC20.deployedBytecode,
        },
        skipIfAlreadyDeployed: false,
    })
    console.log('(L2)JunkCoinDepositedERC20: ' + L2JunkCoinDepositedERC20.address);

    const L1ERC20Gateway = await deployL1ERC20Gateway(
        process.env.L1_MESSENGER_ADDRESS, L1JunkCoinERC20.address, L2JunkCoinDepositedERC20.address, l1Wallet);

    const junkeng = await deploy("Junkeng", {
        from: deployer,
        gasLimit: 8000000,
        args: [L2JunkCoinDepositedERC20.address],
        contract: {
            abi: Junkeng.abi,
            bytecode: Junkeng.bytecode,
            deployedBytecode: Junkeng.deployedBytecode,
        },
        skipIfAlreadyDeployed: false,
    })
    console.log('(L2)Junkeng: ' + junkeng.address);

    await execute("JunkCoinDepositedERC20", {from: deployer, gasLimit: 8000000}, 'init', L1ERC20Gateway.address);
    console.log('(L2)Executed JunkCoinDepositedERC20.init()');
    await execute("JunkCoinDepositedERC20", {from: deployer, gasLimit: 8000000}, 'approve', junkeng.address, '100000000');
    console.log('(L2)Executed JunkCoinDepositedERC20.approve()');
    await execute("JunkCoinDepositedERC20", {from: deployer, gasLimit: 8000000}, 'setDispenser', junkeng.address);
    console.log('(L2)Executed JunkCoinDepositedERC20.setDispenser()');

    await depositL1JunkCoinERC20(L1JunkCoinERC20, L1ERC20Gateway);
}

export default deploy;
