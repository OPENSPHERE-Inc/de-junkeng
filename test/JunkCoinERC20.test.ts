import {expect} from "chai";
import hre from "hardhat";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import {BigNumber, Contract} from "ethers";
import {setupLocal} from "./setup";


describe('JunkCoinERC20', () => {
	let contracts: {[name: string]: Contract };

    beforeEach(async () => {
		contracts = await setupLocal();
    })

	const getContracts = async () => {
		const { deployer, tester1, tester2 } = await hre.ethers.getNamedSigners();
		const JunkCoinERC20 = contracts.L2JunkCoinDepositedERC20.connect(deployer);

		return { JunkCoinERC20, deployer, tester1, tester2 };
	}

	it('Transfer', async () => {
		const { JunkCoinERC20, deployer, tester1 } = await getContracts();

		expect(await JunkCoinERC20.totalSupply()).equal(BigNumber.from(100000000));
		expect(await JunkCoinERC20.balanceOf(deployer.address)).equal(BigNumber.from(100000000));
		expect(await JunkCoinERC20.balanceOf(tester1.address)).equal(BigNumber.from(0));

		await JunkCoinERC20.transfer(tester1.address, 100).then((tx: TransactionResponse) => tx.wait());

		expect(await JunkCoinERC20.balanceOf(deployer.address)).equal(BigNumber.from(99999900));
		expect(await JunkCoinERC20.balanceOf(tester1.address)).equal(BigNumber.from(100));
	})

	it('TransferFrom', async () => {
		const { JunkCoinERC20, deployer, tester1, tester2 } = await getContracts();
		const JunkCoinERC20tester1 = contracts.L2JunkCoinDepositedERC20.connect(tester1);

		expect(await JunkCoinERC20.allowance(deployer.address, tester1.address)).equal(BigNumber.from(0));

		await JunkCoinERC20.approve(tester1.address, 100).then((tx: TransactionResponse) => tx.wait());

		expect(await JunkCoinERC20.allowance(deployer.address, tester1.address)).equal(BigNumber.from(100));

		await JunkCoinERC20tester1.transferFrom(deployer.address, tester2.address, 50).then((tx: TransactionResponse) => tx.wait());

		expect(await JunkCoinERC20.balanceOf(deployer.address)).equal(BigNumber.from(99999950));
		expect(await JunkCoinERC20.balanceOf(tester2.address)).equal(BigNumber.from(50));
		expect(await JunkCoinERC20.allowance(deployer.address, tester1.address)).equal(BigNumber.from(50));
	})

	it('Transfer Error', async () => {
		const { JunkCoinERC20, deployer, tester1, tester2 } = await getContracts();
		const JunkCoinERC20tester1 = contracts.L2JunkCoinDepositedERC20.connect(tester1);

		expect(await JunkCoinERC20tester1.transfer(deployer.address, 100).catch((e: Error) => e.message))
			.to.have.string('ERC20: transfer amount exceeds balance');
		expect(await JunkCoinERC20.transferFrom(deployer.address, tester2.address, 100).catch((e: Error) => e.message))
			.to.have.string('ERC20: transfer amount exceeds allowance');
	})
})

