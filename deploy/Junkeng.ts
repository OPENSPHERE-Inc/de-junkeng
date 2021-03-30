import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import assert from "assert";


/**
 * Deploy target: L2
 * FIXME: The plugin `hardhat-deploy` dosen't work properly on TARGET=OVM
 */
const deploy: DeployFunction = async function ({
    getNamedAccounts,
    deployments,
    getChainId,
    getUnnamedAccounts
}: HardhatRuntimeEnvironment) {
    assert(process.env.L2_MESSENGER_ADDRESS);

    const { deploy, execute } = deployments;
    const { deployer } = await getNamedAccounts();

    const coin = await deploy("JunkCoinDepositedERC20", {
        from: deployer,
        gasLimit: 1000000,
        args: [process.env.L2_MESSENGER_ADDRESS, "JunkCoin", "JKC"],
    })
    console.log('JunkCoinDepositedERC20: ' + coin.address);

    const junkeng = await deploy("Junkeng", {
        from: deployer,
        gasLimit: 1500000,
        args: [coin.address],
    })
    console.log('Junkeng: ' + junkeng.address);

    await execute("JunkCoinDepositedERC20", {from: deployer}, 'increaseAllowance', junkeng.address, '100000000');
}

export default deploy;
