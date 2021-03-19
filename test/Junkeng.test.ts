import {expect} from "chai";
import hre from "hardhat";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import {BigNumber} from "ethers";
import moment from "moment";

describe('Junkeng', () => {
    beforeEach(async () => {
        await hre.deployments.fixture();
    })

    const getContrcts = async () => {
        const { tester1, tester2 } = await hre.getNamedAccounts();
        const Junkeng1 = await hre.ethers.getContract('Junkeng', tester1);
        const Junkeng2 = await hre.ethers.getContract('Junkeng', tester2);

        return { Junkeng1, Junkeng2, tester1, tester2 };
    }

    afterEach(async() => {
        const { Junkeng1, Junkeng2 } = await getContrcts();

        Junkeng1.removeAllListeners('Joined');
        Junkeng1.removeAllListeners('Established');
        Junkeng1.removeAllListeners('Disclosed');
        Junkeng1.removeAllListeners('Settled');
        Junkeng1.removeAllListeners('Earned');
        Junkeng1.removeAllListeners('Withdrew');

        Junkeng2.removeAllListeners('Joined');
        Junkeng2.removeAllListeners('Established');
        Junkeng2.removeAllListeners('Disclosed');
        Junkeng2.removeAllListeners('Settled');
        Junkeng2.removeAllListeners('Earned');
        Junkeng2.removeAllListeners('Withdrew');
    })

    describe('Regular run', () => {
        it('Join Succeed', (done) => {
            (async () => {
                const { Junkeng1, Junkeng2, tester1, tester2 } = await getContrcts();

                const listener = (a: string, a_index: number, b: string, b_index: number) => {
                    console.log(`Established a ${a} a_index ${a_index} b ${b} b_index ${b_index}`);

                    expect(a).equal(tester1);
                    expect(a_index).equal(0);
                    expect(b).equal(tester2);
                    expect(b_index).equal(1);

                    done();
                }

                Junkeng1.on('Established', listener);

                await Junkeng1.join().then((tx: TransactionResponse) => tx.wait());
                await Junkeng2.join().then((tx: TransactionResponse) => tx.wait());
            })()
        })

        it('Get Status Succeed (1)', async () => {
            const { Junkeng1, Junkeng2, tester1, tester2 } = await getContrcts();

            await Junkeng1.join().then((tx: TransactionResponse) => tx.wait());
            await Junkeng2.join().then((tx: TransactionResponse) => tx.wait());

            const status1 = await Junkeng1.getStatus();
            const status1op = await Junkeng1.getOpponentStatus();
            const status2 = await Junkeng2.getStatus();
            const status2op = await Junkeng2.getOpponentStatus();

            expect(status1.addr).equal(tester1);
            expect(status1.index).equal(0);
            expect(status1.status).equal(1);
            expect(status1.handShape).equal(0);
            expect(status1.index).equal(status2op.index);

            expect(status2.addr).equal(tester2);
            expect(status2.index).equal(1);
            expect(status2.status).equal(1);
            expect(status2.handShape).equal(0);
            expect(status2.index).equal(status1op.index);
        })

        it('Disclose Succeed', (done) => {
            (async () => {
                const { Junkeng1, Junkeng2, tester1, tester2 } = await getContrcts();

                await Junkeng1.join().then((tx: TransactionResponse) => tx.wait());
                await Junkeng2.join().then((tx: TransactionResponse) => tx.wait());

                let count = 0;

                const disclosedListener = (addr: string, index: BigNumber) => {
                    console.log(`Disclosed addr ${addr} index ${index}`);

                    expect(addr).oneOf([tester1, tester2]);
                    expect(index.toString()).oneOf(['0', '1']);

                    if (++count == 4) {
                        done();
                    }
                }

                const settledListener = (a: string, a_index: BigNumber, a_handShape: number, b: string, b_index: BigNumber, b_handShape: number) => {
                    console.log(`Settled a ${a} a_index ${a_index} a_handShape ${a_handShape} b ${b} b_index ${b_index} b_handShape ${b_handShape}`);

                    expect(a).equal(tester2);
                    expect(a_index).equal(BigNumber.from(1));
                    expect(a_handShape).equal(2);
                    expect(b).equal(tester1);
                    expect(b_index).equal(BigNumber.from(0));
                    expect(b_handShape).equal(1);

                    if (++count == 4) {
                        done();
                    }
                }

                const earnedListener = (addr: string, index: BigNumber, amount: BigNumber) => {
                    console.log(`Earned addr ${addr} index ${index} amount ${amount}`);

                    expect(addr).equal(tester1)
                    expect(index).equal(BigNumber.from(0));
                    expect(amount).equal(BigNumber.from(1));

                    if (++count == 4) {
                        done();
                    }
                }

                Junkeng1.on('Disclosed', disclosedListener);
                Junkeng1.on('Settled', settledListener);
                Junkeng1.on('Earned', earnedListener);

                await Junkeng1.disclose(1).then((tx: TransactionResponse) => tx.wait());
                await Junkeng2.disclose(2).then((tx: TransactionResponse) => tx.wait());
            })()
        })

        it('Get Status Succeed (2)', async () => {
            const { Junkeng1, Junkeng2, tester1, tester2 } = await getContrcts();

            await Junkeng1.join().then((tx: TransactionResponse) => tx.wait());
            await Junkeng2.join().then((tx: TransactionResponse) => tx.wait());
            await Junkeng1.disclose(1).then((tx: TransactionResponse) => tx.wait());
            await Junkeng2.disclose(2).then((tx: TransactionResponse) => tx.wait());

            const status1 = await Junkeng1.getStatus();
            const status1op = await Junkeng1.getOpponentStatus();
            const status2 = await Junkeng2.getStatus();
            const status2op = await Junkeng2.getOpponentStatus();

            expect(status1.addr).equal(tester1);
            expect(status1.index).equal(BigNumber.from(0));
            expect(status1.status).equal(3);
            expect(status1.handShape).equal(1);
            expect(status1.index).equal(status2op.index);

            expect(status2.addr).equal(tester2);
            expect(status2.index).equal(BigNumber.from(1));
            expect(status2.status).equal(3);
            expect(status2.handShape).equal(2);
            expect(status2.index).equal(status1op.index);
        })

        it('Coin was earned', (done) => {
            (async () => {
                const {Junkeng1, Junkeng2, tester1} = await getContrcts();

                await Junkeng1.join().then((tx: TransactionResponse) => tx.wait());
                await Junkeng2.join().then((tx: TransactionResponse) => tx.wait());
                await Junkeng1.disclose(1).then((tx: TransactionResponse) => tx.wait());
                await Junkeng2.disclose(2).then((tx: TransactionResponse) => tx.wait());

                const withdrewListener = async (addr: string, amount: BigNumber) => {
                    console.log(`Withdrew addr ${addr} amount ${amount}`);

                    expect(addr).equal(tester1)
                    expect(amount).equal(BigNumber.from(1));

                    const Coin1 = await hre.ethers.getContract('JunkCoinERC20', tester1);

                    expect(await Coin1.balanceOf(tester1)).equal(BigNumber.from(1));

                    done();
                }

                Junkeng1.on('Withdrew', withdrewListener);

                await Junkeng1.withdraw().then((tx: TransactionResponse) => tx.wait());
            })()
        })

        it('Get coin balance Succeed', async () => {
            const { Junkeng1, Junkeng2 } = await getContrcts();

            await Junkeng1.join().then((tx: TransactionResponse) => tx.wait());
            await Junkeng2.join().then((tx: TransactionResponse) => tx.wait());
            await Junkeng1.disclose(1).then((tx: TransactionResponse) => tx.wait());
            await Junkeng2.disclose(2).then((tx: TransactionResponse) => tx.wait());

            const coins = await Junkeng1.getCoinBalance(moment().unix());

            expect(coins).equal(1);
        })
    })

    describe("Irregular run", () => {
        it('Errors (1)', async () => {
            const { Junkeng1, Junkeng2 } = await getContrcts();

            expect(await Junkeng1.disclose(2)
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Not participants');
        })

        it('Errors (2)', async () => {
            const { Junkeng1, Junkeng2 } = await getContrcts();

            expect(await Junkeng1.withdraw()
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('No coins');
        })

        it('Errors (3)', async () => {
            const { Junkeng1, Junkeng2 } = await getContrcts();

            // Join succeed
            await Junkeng1.join().then((tx: TransactionResponse) => tx.wait());

            expect(await Junkeng1.disclose(1)
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Opponent not ready');

            expect(await Junkeng1.join()
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Already participated');
        })

        it('Errors (4)', async () => {
            const { Junkeng1, Junkeng2 } = await getContrcts();

            // Join succeed
            await Junkeng1.join().then((tx: TransactionResponse) => tx.wait());
            // Join succeed
            await Junkeng2.join().then((tx: TransactionResponse) => tx.wait());

            expect(await Junkeng1.disclose(5)
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Invalid hand shape');

            // Disclose succeed
            await Junkeng1.disclose(3).then((tx: TransactionResponse) => tx.wait());

            expect(await Junkeng1.disclose(2)
                .then((tx: TransactionResponse) => tx.wait())
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('Already disclosed');
        })

        it('Errors (5)', async () => {
            const { Junkeng1, Junkeng2 } = await getContrcts();

            expect(await Junkeng1.getStatus()
                .catch((e: Error) => {
                    console.log(e.message);
                    return e.message;
                }))
                .to.have.string('No registration')
        })
    })
})
