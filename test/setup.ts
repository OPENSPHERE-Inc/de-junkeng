import { ContractFactory } from "ethers";
import {getContractFactory} from "@eth-optimism/contracts";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import hre from "hardhat";

import * as JunkCoinERC20 from '../artifacts/contracts/JunkCoinERC20.sol/JunkCoinERC20.json';
import * as JunkCoinDepositedERC20 from '../artifacts/contracts/JunkCoinDepositedERC20.sol/JunkCoinDepositedERC20.json';
import * as Junkeng from '../artifacts/contracts/Junkeng.sol/Junkeng.json';


export const setupLocal = hre.deployments.createFixture(async () => {
    const { deployer } = await hre.ethers.getNamedSigners();

    // Mock of CrossDomainMessenger
    const L1CrossDomainMessengerFactory = getContractFactory('mockOVM_CrossDomainMessenger', deployer);
    const L1CrossDomainMessenger = await L1CrossDomainMessengerFactory.deploy(0);
    await L1CrossDomainMessenger.deployTransaction.wait();
    console.log('(L1)CrossDomainMessenger: ' + L1CrossDomainMessenger.address);

    const L2CrossDomainMessengerFactory = getContractFactory('mockOVM_CrossDomainMessenger', deployer);
    const L2CrossDomainMessenger = await L2CrossDomainMessengerFactory.deploy(0);
    await L2CrossDomainMessenger.deployTransaction.wait();

    await L1CrossDomainMessenger.setTargetMessengerAddress(L2CrossDomainMessenger.address)
        .then((tx: TransactionResponse) => tx.wait());
    await L2CrossDomainMessenger.setTargetMessengerAddress(L1CrossDomainMessenger.address)
        .then((tx: TransactionResponse) => tx.wait());
    console.log('(L2)CrossDomainMessenger: ' + L2CrossDomainMessenger.address);

    // Deploy L1 contracts
    const L1JunkCoinERC20Factory = new ContractFactory(JunkCoinERC20.abi, JunkCoinERC20.bytecode, deployer);
    const L1JunkCoinERC20 = await L1JunkCoinERC20Factory.deploy(
        "JunkCoin",
        "JKC",
        100000000,
    )
    await L1JunkCoinERC20.deployTransaction.wait();
    console.log('(L1)JunkCoinERC20: ' + L1JunkCoinERC20.address);

    // Deploy L2 contracts
    const L2JunkCoinDepositedERC20Factory = new ContractFactory(JunkCoinDepositedERC20.abi, JunkCoinDepositedERC20.bytecode, deployer);
    const L2JunkCoinDepositedERC20 = await L2JunkCoinDepositedERC20Factory.deploy(
        L2CrossDomainMessenger.address,
        "JunkCoin",
        "JKC"
    )
    await L2JunkCoinDepositedERC20.deployTransaction.wait();
    console.log('(L2)JunkCoinDepositedERC20: ' + L2JunkCoinDepositedERC20.address);

    const L2JunkengFactory = new ContractFactory(Junkeng.abi, Junkeng.bytecode, deployer);
    const L2Junkeng = await L2JunkengFactory.deploy(
        L2JunkCoinDepositedERC20.address
    )
    await L2Junkeng.deployTransaction.wait();
    console.log('(L2)Junkeng: ' + L2Junkeng.address);

    // Deploy L1 contracts
    const L1ERC20GatewayFactory = getContractFactory('OVM_L1ERC20Gateway', deployer);
    const L1ERC20Gateway = await L1ERC20GatewayFactory.deploy(
        L1JunkCoinERC20.address,
        L2JunkCoinDepositedERC20.address,
        L1CrossDomainMessenger.address,
    )
    await L1ERC20Gateway.deployTransaction.wait();
    console.log('(L1)OVM_L1ERC20Gateway: ' + L1ERC20Gateway.address);

    // Init L2 contracts
    await L2JunkCoinDepositedERC20.init(L1ERC20Gateway.address, { gasLimit: 1000000 })
        .then((tx: TransactionResponse) => tx.wait());
    await L2JunkCoinDepositedERC20.increaseAllowance(L2Junkeng.address, 100000000, { gasLimit: 1000000 })
        .then((tx: TransactionResponse) => tx.wait());
    await L2JunkCoinDepositedERC20.setDispenser(L2Junkeng.address, { gasLimit: 1000000 })
        .then((tx: TransactionResponse) => tx.wait());
    console.log('(L2)JunkCoinDepositedERC20 has been initialized.');

    // Deposit full balance of token
    await L1JunkCoinERC20.increaseAllowance(L1ERC20Gateway.address, 100000000, { gasLimit: 1000000 })
        .then((tx: TransactionResponse) => tx.wait());
    await L1ERC20Gateway.deposit(100000000, { gasLimit: 1000000 })
        .then((tx: TransactionResponse) => tx.wait());
    await L2CrossDomainMessenger.relayNextMessage({ gasLimit: 9500000 })
        .then((tx: TransactionResponse) => tx.wait());
    console.log('(L1)JunkCoinERC20 has been deposited.');

    return {
        L1CrossDomainMessenger,
        L2CrossDomainMessenger,
        L1JunkCoinERC20,
        L2JunkCoinDepositedERC20,
        L2Junkeng,
        L1ERC20Gateway,
    }
})
