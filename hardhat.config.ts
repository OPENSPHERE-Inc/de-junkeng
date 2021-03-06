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

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
    react: {
        providerPriority: ["web3modal", "hardhat"],
    },
    defaultNetwork: "rinkeby",
    networks: {
        hardhat: {
            inject: false, // optional. If true, it will EXPOSE your mnemonic in your frontend code. Then it would be available as an "in-page browser wallet" / signer which can sign without confirmation.
            accounts: {
                mnemonic: "test test test test test test test test test test test junk", // test test test test test test test test test test test junk
            },
        },
        rinkeby: {
            url: process.env.RINKEBY_URL,
            accounts: {
                mnemonic: process.env.WALLET_MNEMONIC
            }
        }
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        tester1: {
            default: 1,
        },
        tester2: {
            default: 2,
        }
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
};
export default config;
