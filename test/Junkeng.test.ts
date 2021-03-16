import {expect} from "chai";
import hre from "hardhat";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import {BigNumber} from "ethers";

describe('Junkeng', () => {
    before(async () => {
        await hre.deployments.fixture();
    })

    describe('Regular run', () => {
        it('Join Succeed', (done) => {
            (async () => {
                const {tester1, tester2} = await hre.getNamedAccounts();
                const Junkeng1 = await hre.ethers.getContract('Junkeng', tester1);
                const Junkeng2 = await hre.ethers.getContract('Junkeng', tester2);

                const listener = (a_index: number, b_index: number) => {
                    console.log(`Established a_index ${a_index} b_index ${b_index}`);

                    expect(a_index).equal(0);
                    expect(b_index).equal(1);

                    Junkeng1.off('Established', listener);
                    done();
                }

                Junkeng1.on('Established', listener);

                await Junkeng1.join().then((tx: TransactionResponse) => tx.wait());
                await Junkeng2.join().then((tx: TransactionResponse) => tx.wait());
            })()
        })

        it('Disclose Succeed', (done) => {
            (async () => {
                const {tester1, tester2} = await hre.getNamedAccounts();
                const Junkeng1 = await hre.ethers.getContract('Junkeng', tester1);
                const Junkeng2 = await hre.ethers.getContract('Junkeng', tester2);

                const listener = (a_index: number, a_handShape: number, b_index: number, b_handShape: number) => {
                    console.log(`Disclosed a_index ${a_index} a_handShape ${a_handShape} b_index ${b_index} b_handShape ${b_handShape}`);

                    expect(a_index).equal(1);
                    expect(a_handShape).equal(2);
                    expect(b_index).equal(0);
                    expect(b_handShape).equal(1);

                    Junkeng1.off('Disclosed', listener);
                    done();
                };

                Junkeng1.on('Disclosed', listener);

                await Junkeng1.disclose(1).then((tx: TransactionResponse) => tx.wait());
                await Junkeng2.disclose(2).then((tx: TransactionResponse) => tx.wait());
            })()
        })

        it('Settle Succeed', (done) => {
            (async () => {
                const {tester1, tester2} = await hre.getNamedAccounts();
                const Junkeng1 = await hre.ethers.getContract('Junkeng', tester1);
                const Junkeng2 = await hre.ethers.getContract('Junkeng', tester2);

                let count = 0;

                const listener = (index: number, handShape: number, result: number) => {
                    console.log(`Settle index ${index} handShape ${handShape} result ${result}`);

                    if (index === 0) {
                        expect(handShape).equal(0);
                        expect(result).equal(1);
                    } else if (index === 1) {
                        expect(handShape).equal(1);
                        expect(result).equal(-1);
                    }

                    if (++count === 2) {
                        Junkeng1.off('Settled', listener);
                        done();
                    }
                }

                Junkeng1.on('Settled', listener);

                await Junkeng1.settle().then((tx: TransactionResponse) => tx.wait());
                await Junkeng2.settle().then((tx: TransactionResponse) => tx.wait());
            })()
        })

        it('Coin was earned', async () => {
            const {tester1} = await hre.getNamedAccounts();
            const Coin1 = await hre.ethers.getContract('JunkCoinERC20', tester1);

            expect(await Coin1.balanceOf(tester1)).equal(BigNumber.from(1));
        })
    })

    describe("Irregular run", () => {
        it('Errors (1)', async () => {
            const {tester1} = await hre.getNamedAccounts();
            const Junkeng1 = await hre.ethers.getContract('Junkeng', tester1);

            expect(await Junkeng1.disclose(2)
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Not participants');
        })

        it('Errors (2)', async () => {
            const {tester1} = await hre.getNamedAccounts();
            const Junkeng1 = await hre.ethers.getContract('Junkeng', tester1);

            expect(await Junkeng1.settle()
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Not participants');
        })

        it('Errors (3)', async () => {
            const {tester1} = await hre.getNamedAccounts();
            const Junkeng1 = await hre.ethers.getContract('Junkeng', tester1);

            await Junkeng1.join().then((tx: TransactionResponse) => tx.wait());

            expect(await Junkeng1.disclose(1)
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Opponent not ready');

            expect(await Junkeng1.settle()
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Not disclosed yet');

            expect(await Junkeng1.join()
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Already participated');
        })

        it('Errors (4)', async () => {
            const {tester1, tester2} = await hre.getNamedAccounts();
            const Junkeng1 = await hre.ethers.getContract('Junkeng', tester1);
            const Junkeng2 = await hre.ethers.getContract('Junkeng', tester2);

            await Junkeng2.join().then((tx: TransactionResponse) => tx.wait());

            expect(await Junkeng1.settle()
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Not disclosed yet');

            expect(await Junkeng1.disclose(5)
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Invalid hand shape');

            await Junkeng1.disclose(3).then((tx: TransactionResponse) => tx.wait());

            expect(await Junkeng1.disclose(2)
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Already disclosed');

            expect(await Junkeng1.settle()
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Opponent hasn\'t disclosed hand shape');
        })

        it('Errors (5)', async () => {
            const {tester1, tester2} = await hre.getNamedAccounts();
            const Junkeng1 = await hre.ethers.getContract('Junkeng', tester1);
            const Junkeng2 = await hre.ethers.getContract('Junkeng', tester2);

            await Junkeng2.disclose(3).then((tx: TransactionResponse) => tx.wait());

            expect(await Junkeng2.join()
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Already participated');
        })
    })

    describe("Rare case", () => {
        it('Late Settle Succeed', (done) => {
            (async () => {
                const {tester1, tester2} = await hre.getNamedAccounts();
                const Junkeng1 = await hre.ethers.getContract('Junkeng', tester1);
                const Junkeng2 = await hre.ethers.getContract('Junkeng', tester2);

                await Junkeng1.settle().then((tx: TransactionResponse) => tx.wait());
                await Junkeng1.join().then((tx: TransactionResponse) => tx.wait());

                let count = 0;

                const listener = (index: number, handShape: number, result: number) => {
                    console.log(`Settle index ${index} handShape ${handShape} result ${result}`);

                    expect(handShape).equal(3);
                    expect(result).equal(0);

                    Junkeng2.off('Settled', listener);

                    if (++count === 2) {
                        done();
                    }
                }

                Junkeng2.on('Settled', listener);

                await Junkeng2.settle().then((tx: TransactionResponse) => tx.wait());
            })()
        })
    })
})
