import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const deploy: DeployFunction = async function ({
    getNamedAccounts,
    deployments,
    getChainId,
    getUnnamedAccounts
}: HardhatRuntimeEnvironment) {
    const { deploy, execute } = deployments;
    const { deployer } = await getNamedAccounts();

    const coin = await deploy("JunkCoinERC20", {
        from: deployer,
        args: [],
    });

    const junkeng = await deploy("Junkeng", {
        from: deployer,
        // gas: 4000000,
        args: [coin.address],
    });

    await execute("JunkCoinERC20", {from: deployer}, 'increaseAllowance', junkeng.address, '100000000');
};

export default deploy;
