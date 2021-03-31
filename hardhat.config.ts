import dotenv from "dotenv";
dotenv.config();

import {HardhatUserConfig, task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@symfoni/hardhat-react";
import "hardhat-typechain";
import "@typechain/ethers-v5";
import "@eth-optimism/plugins/hardhat/compiler";
import assert from "assert";

assert(process.env.WALLET_PRIVATE_KEY_DEPLOYER);
assert(process.env.WALLET_PRIVATE_KEY_SEQUENCER);
assert(process.env.WALLET_PRIVATE_KEY_TESTER1);
assert(process.env.WALLET_PRIVATE_KEY_TESTER2);
assert(process.env.L1_WEB3_URL);
assert(process.env.L2_WEB3_URL);
assert(process.env.L1_MESSENGER_ADDRESS);
assert(process.env.L2_MESSENGER_ADDRESS);


task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
})


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
    react: {
        providerPriority: ["web3modal", "hardhat"],
    },
    defaultNetwork: "layer2",
    networks: {
        hardhat: {
            inject: false,
            accounts: {
                mnemonic: "test test test test test test test test test test test junk",
            },
        },
        layer2: {
            url: process.env.L2_WEB3_URL,
            accounts: [
                process.env.WALLET_PRIVATE_KEY_DEPLOYER,
                process.env.WALLET_PRIVATE_KEY_SEQUENCER,
                process.env.WALLET_PRIVATE_KEY_TESTER1,
                process.env.WALLET_PRIVATE_KEY_TESTER2,
            ],
        },
        layer1: {
            url: process.env.L1_WEB3_URL,
            accounts: [
                process.env.WALLET_PRIVATE_KEY_DEPLOYER,
                process.env.WALLET_PRIVATE_KEY_SEQUENCER,
                process.env.WALLET_PRIVATE_KEY_TESTER1,
                process.env.WALLET_PRIVATE_KEY_TESTER2,
            ],
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        sequencer: {
            default: 1,
        },
        tester1: {
            default: 2,
        },
        tester2: {
            default: 3,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.7.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1000,
                    },
                },
            },
        ],
    },
}

export default config;
