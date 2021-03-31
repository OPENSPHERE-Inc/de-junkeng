import { Wallet, ContractFactory, Contract } from "ethers";
import { JsonRpcProvider, Provider } from "@ethersproject/providers";
import {getContractFactory} from "@eth-optimism/contracts";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import assert from "assert";
import fs from "fs";

import * as JunkCoinERC20 from '../artifacts/contracts/JunkCoinERC20.sol/JunkCoinERC20.json';
import * as JunkCoinDepositedERC20 from '../artifacts-ovm/contracts/JunkCoinDepositedERC20.sol/JunkCoinDepositedERC20.json';
import * as Junkeng from '../artifacts-ovm/contracts/Junkeng.sol/Junkeng.json';


const main = async () => {
    assert(process.env.WALLET_PRIVATE_KEY_DEPLOYER);
    assert(process.env.L1_WEB3_URL);
    assert(process.env.L2_WEB3_URL);
    assert(process.env.L1_MESSENGER_ADDRESS);
    assert(process.env.L2_MESSENGER_ADDRESS);

    const l1Provider = new JsonRpcProvider(process.env.L1_WEB3_URL);
    const l1Wallet = new Wallet(process.env.WALLET_PRIVATE_KEY_DEPLOYER, l1Provider);

    const l2Provider = new JsonRpcProvider(process.env.L2_WEB3_URL);
    const l2Wallet = new Wallet(process.env.WALLET_PRIVATE_KEY_DEPLOYER, l2Provider);

    // Deploy L1 contracts
    const L1JunkCoinERC20Factory = new ContractFactory(JunkCoinERC20.abi, JunkCoinERC20.bytecode, l1Wallet);
    const L1JunkCoinERC20 = await L1JunkCoinERC20Factory.deploy(
        "JunkCoin",
        "JKC",
        100000000,
    )
    await L1JunkCoinERC20.deployTransaction.wait();
    console.log('(L1)JunkCoinERC20: ' + L1JunkCoinERC20.address);

    // Deploy L2 contracts
    const L2JunkCoinDepositedERC20Factory = new ContractFactory(JunkCoinDepositedERC20.abi, JunkCoinDepositedERC20.bytecode, l2Wallet);
    const L2JunkCoinDepositedERC20 = await L2JunkCoinDepositedERC20Factory.deploy(
        process.env.L2_MESSENGER_ADDRESS,
        "JunkCoin",
        "JKC"
    )
    await L2JunkCoinDepositedERC20.deployTransaction.wait();
    console.log('(L2)JunkCoinDepositedERC20: ' + L2JunkCoinDepositedERC20.address);

    const L2JunkengFactory = new ContractFactory(Junkeng.abi, Junkeng.bytecode, l2Wallet);
    const L2Junkeng = await L2JunkengFactory.deploy(
        L2JunkCoinDepositedERC20.address
    )
    await L2Junkeng.deployTransaction.wait();
    console.log('(L2)Junkeng: ' + L2Junkeng.address);

    // Deploy L1 contracts
    const L1ERC20GatewayFactory = getContractFactory('OVM_L1ERC20Gateway');
    const L1ERC20Gateway = await L1ERC20GatewayFactory.connect(l1Wallet).deploy(
        L1JunkCoinERC20.address,
        L2JunkCoinDepositedERC20.address,
        process.env.L1_MESSENGER_ADDRESS,
    )
    await L1ERC20Gateway.deployTransaction.wait();
    console.log('(L1)OVM_L1ERC20Gateway: ' + L1ERC20Gateway.address);

    // Init L2 contracts
    await L2JunkCoinDepositedERC20.init(L1ERC20Gateway.address)
        .then((tx: TransactionResponse) => tx.wait());
    await L2JunkCoinDepositedERC20.increaseAllowance(L2Junkeng.address, 100000000, { gasLimit: 1000000 })
        .then((tx: TransactionResponse) => tx.wait());
    await L2JunkCoinDepositedERC20.setDispenser(L2Junkeng.address)
        .then((tx: TransactionResponse) => tx.wait());
    console.log('(L2)JunkCoinDepositedERC20 has been initialized.');

    // Deposit full balance of token
    await L1JunkCoinERC20.increaseAllowance(L1ERC20Gateway.address, 100000000, { gasLimit: 1000000 })
        .then((tx: TransactionResponse) => tx.wait());
    await L1ERC20Gateway.deposit(100000000, { gasLimit: 1000000 })
        .then((tx: TransactionResponse) => tx.wait());
    console.log('(L1)JunkCoinERC20 has been deposited.');

    // Output contract address to frontend's .env
    fs.writeFileSync('./frontend/.env',
        `REACT_APP_JUNKENG_ADDR=${L2Junkeng.address}\n` +
        `REACT_APP_JUNKCOIN_ADDR=${L2JunkCoinDepositedERC20.address}`,
        { encoding: 'utf-8', flag: 'w+' });
}


main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
