import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {CurrentAddressContext, JunkengContext} from "../hardhat/SymfoniContext";
import moment from "moment";
import {BigNumber} from "ethers";
import createPersistedState from "use-persisted-state";


export const lookupTable = [
    [ -1, -1, -1, -1 ],
    [  1,  0,  1, -1 ],
    [  1, -1,  0,  1 ],
    [  1,  1, -1,  0 ],
]

export enum MatchStatus {
    PREMATCH,
    ESTABLISHED,
    SETTLED,
}

export enum ParticipantStatus {
    NOT_PARTICIPATE,
    PARTICIPATED,
    DISCLOSED,
    SETTLED,
}

export interface ParticipantState {
    index: number,
    addr: string,
    status: ParticipantStatus,
    handShape: number,
    timestamp :number,
    streak: number,
    phase: BigNumber,
    transient?: boolean,
}

export const defaultParticipantState: ParticipantState = {
    index: 0,
    addr: '',
    status: ParticipantStatus.NOT_PARTICIPATE,
    handShape: 0,
    timestamp: 0,
    streak: 0,
    phase: BigNumber.from(0),
}

export interface MatchContextStore {
    participant: ParticipantState,
    setParticipant: (value: ParticipantState) => void,
    opponent: ParticipantState,
    setOpponent: (value: ParticipantState) => void,
    status: MatchStatus,
    setStatus: (value: MatchStatus) => void,
    loading: boolean,
    setLoading: (value: boolean) => void,
    earned: number,
    setEarned: (value: number) => void,
    timestamp: number,
    setTimestamp: (value: number) => void,
    getParticipantStatus: () => Promise<{ participant: ParticipantState, opponent: ParticipantState }>,
    coinBalance: string,
    setCoinBalance: (value: string) => void,
    getCoinBalance: () => Promise<string>,
    winStreak: number,
    setWinStreak: (value: number) => void,
}

export const MatchContext = createContext<MatchContextStore>({
    participant: defaultParticipantState,
    setParticipant: (value) => {},
    opponent: defaultParticipantState,
    setOpponent: (value) => {},
    status: MatchStatus.PREMATCH,
    setStatus: (value) => {},
    loading: true,
    setLoading: (value) => {},
    earned: 0,
    setEarned: (value) => {},
    timestamp: 0,
    setTimestamp: (value) => {},
    getParticipantStatus: async () => ({ participant: defaultParticipantState, opponent: defaultParticipantState }),
    coinBalance: '0',
    setCoinBalance: (value) => {},
    getCoinBalance: async () => '0',
    winStreak: 0,
    setWinStreak: (value) => {},
})

// Store participant states to local storage
const useParticipantState = createPersistedState('junkeng:participantState');
const useOpponentState = createPersistedState('junkeng:opponentState');

export const useMatch = (): MatchContextStore => {
    const [status, setStatus] = useState(MatchStatus.PREMATCH);
    const [participant, setParticipant] = useParticipantState<ParticipantState>(defaultParticipantState);
    const [opponent, setOpponent] = useOpponentState<ParticipantState>(defaultParticipantState);
    const [loading, setLoading] = useState(true);
    const [earned, setEarned] = useState(0);
    const [timestamp, setTimestamp] = useState(0);
    const [coinBalance, setCoinBalance] = useState('0');
    const [winStreak, setWinStreak] = useState(0);

    // Local usage
    const junkeng = useContext(JunkengContext);
    const [currentAddress] = useContext(CurrentAddressContext);


    // Retrieve coin balance from on-chain
    const getCoinBalance = useCallback(async () => {
        if (!junkeng.instance) {
            return '0';
        }

        const balance = await junkeng.instance.getCoinBalance(moment().unix())
            .catch((e) => {
                console.error(e);
                return '0'
            })
        setCoinBalance(balance.toString());

        return balance.toString();
    }, [junkeng.instance]);


    // Retrieve participant/opponent status from on-chain
    const getParticipantStatus = useCallback(async () => {
        if (!junkeng.instance) {
            return { participant: defaultParticipantState, opponent: defaultParticipantState }
        }

        // Retrieve participant state
        const p = await junkeng.instance.getStatus()
            .then((result): ParticipantState => {
                const index = result.index;
                const phase = result.phase;

                if (index.eq(participant.index) && phase.eq(participant.phase)) {
                    // On-chain state not changed: Do not update local state
                    console.debug('Use participant transient state');
                    return participant;
                } else {
                    return {
                        index: result.index.toNumber(),
                        status: result.status,
                        handShape: result.handShape,
                        addr: result.addr,
                        timestamp: result.timestamp.toNumber(),
                        streak: result.streak.toNumber(),
                        phase: result.phase,
                    }
                }
            })
            .catch((e) => {
                // FIXME: Reload browser after first join click, the join button is enabled again.
                return {
                    ...defaultParticipantState,
                    addr: currentAddress,
                }
            })

        // Retrieve opponent state
        const o = await junkeng.instance.getOpponentStatus()
            .then((result): ParticipantState => {
                const index = result.index;
                const phase = result.phase;

                if (index.eq(opponent.index) && phase.eq(opponent.phase)) {
                    // On-chain state not changed: Do not update local state
                    console.debug('Use opponent transient state');
                    return opponent;
                } else {
                    return {
                        index: result.index.toNumber(),
                        status: result.status,
                        handShape: result.handShape,
                        addr: result.addr,
                        timestamp: result.timestamp.toNumber(),
                        streak: result.streak.toNumber(),
                        phase: result.phase,
                    }
                }
            })
            .catch((e) => {
                return defaultParticipantState;
            })

        // Always query coin balance
        await getCoinBalance();

        // Timeout is off-chain only event
        if (o.status >= ParticipantStatus.PARTICIPATED &&
            (
                p.status < ParticipantStatus.DISCLOSED ||
                o.status < ParticipantStatus.DISCLOSED
            )
        ) {
            // Established and not settled yet
            // Update timestamp
            const timestamp = Math.max(p.timestamp, o.timestamp);
            setTimestamp(timestamp * 1000);  // Unix secs -> msecs

            // Keep deadline
            const duration = moment().unix() - timestamp;
            if (duration > 5 * 60) {
                p.status = ParticipantStatus.DISCLOSED;
                o.status = ParticipantStatus.DISCLOSED;
            }
        } else {
            setTimestamp(0);
        }

        // Calculate win streak
        let ws = p.streak;
        if (p.status === ParticipantStatus.DISCLOSED &&
            o.status === ParticipantStatus.DISCLOSED)
        {
            if (p.handShape === 0) {
                // DEFLOSS (Off-chan only state)
                ws = 0;
            } else if (o.handShape === 0) {
                // DEFWIN (Off-chan only state)
                ws = p.streak + 1;
            } else if (lookupTable[p.handShape][o.handShape] === 1) {
                // Win
                ws = p.streak;
            } else {
                // Lose
                ws = 0;
            }

            setEarned(ws);
        }
        setWinStreak(ws);

        console.debug('Participant', p);
        console.debug('Opponent', o);

        setParticipant(p);
        setOpponent(o);

        return { participant: p, opponent: o };
    }, [junkeng.instance, getCoinBalance, participant, opponent, currentAddress]);


    // Execute once after page reload
    useEffect(() => {
        if (!junkeng.instance) {
            return;
        }

        console.debug('Load initial state');

        const transition = (
            {participant, opponent}: {participant: ParticipantState, opponent: ParticipantState}
        ) => {
            if (
                participant.status >= ParticipantStatus.DISCLOSED &&
                opponent.status >= ParticipantStatus.DISCLOSED &&
                !participant.transient
            ) {
                setStatus(MatchStatus.SETTLED);
                console.debug('SETTLED');
            } else if (
                participant.status >= ParticipantStatus.DISCLOSED ||
                opponent.status >= ParticipantStatus.DISCLOSED ||
                (
                    participant.status === ParticipantStatus.PARTICIPATED &&
                    opponent.status === ParticipantStatus.PARTICIPATED &&
                    !participant.transient
                )
            ) {
                setStatus(MatchStatus.ESTABLISHED);
                console.debug('ESTABLISHED');
            } else {
                setStatus(MatchStatus.PREMATCH);
                console.debug('PREMATCH');
            }
            setLoading(false);
        }

        getParticipantStatus()
            .then(transition)
            .catch(console.error)

    }, [])


    // Register event handler
    useEffect(() => {
        if (!junkeng.instance) {
            return;
        }
        const instance = junkeng.instance;

        const joinedHandler = async (addr: string, index: BigNumber) => {
            console.debug('Received event: Joined');
            if (addr === currentAddress) {
                await getParticipantStatus()
                    .then(({participant, opponent}) => {
                        if (participant.status === ParticipantStatus.PARTICIPATED && opponent.status === ParticipantStatus.PARTICIPATED) {
                            setStatus(MatchStatus.ESTABLISHED);
                            console.debug('ESTABLISHED');
                        } else {
                            setStatus(MatchStatus.PREMATCH);
                            console.debug('PREMATCH');
                        }
                    })
            }
        }

        const establishedHandler = async (
            a: string, a_index: BigNumber, b: string, b_index: BigNumber, timestamp: BigNumber
        ) => {
            console.debug('Received event: Established');
            if (currentAddress === a || currentAddress === b) {
                await getParticipantStatus()
                    .then(() => {
                        setStatus(MatchStatus.ESTABLISHED);
                        console.debug('ESTABLISHED');
                    })
            }
        }

        const disclosedHandler = async (addr: string, index: BigNumber) => {
            console.debug('Received event: Disclosed');
            if (currentAddress === addr) {
                await getParticipantStatus()
                    .then(({participant, opponent}) => {
                        if (participant.status >= ParticipantStatus.DISCLOSED && opponent.status >= ParticipantStatus.DISCLOSED) {
                            setStatus(MatchStatus.SETTLED);
                            console.debug('SETTLED');
                        } else {
                            setStatus(MatchStatus.ESTABLISHED);
                            console.debug('ESTABLISHED');
                        }
                    })
            }
        }

        const settledHandler = async (
            a: string, a_index: BigNumber, a_handShape: number, b: string, b_index: BigNumber, b_handShape: number
        ) => {
            console.debug('Received event: Settled');
            if (currentAddress === a || currentAddress === b) {
                await getParticipantStatus()
                    .then(() => {
                        setStatus(MatchStatus.SETTLED);
                        console.debug('SETTLED');
                    })
            }
        }

        const earnedHandler = async (addr: string, index: BigNumber, amount: BigNumber) => {
            console.debug('Received event: Earned');
            if (currentAddress === addr) {
                setEarned(amount.toNumber());
                await getCoinBalance();
            }
        }

        instance.on('Joined', joinedHandler);
        instance.on('Established', establishedHandler);
        instance.on('Disclosed', disclosedHandler);
        instance.on('Settled', settledHandler);
        instance.on('Earned', earnedHandler);

        return () => {
            instance.off('Joined', joinedHandler);
            instance.off('Established', establishedHandler);
            instance.off('Disclosed', disclosedHandler);
            instance.off('Settled', settledHandler);
            instance.off('Earned', earnedHandler);
        }
    }, [
        junkeng.instance,
        currentAddress,
        participant,
        setParticipant,
        opponent,
        setOpponent,
        getCoinBalance,
        getParticipantStatus,
    ])

    return {
        participant,
        setParticipant,
        opponent,
        setOpponent,
        status,
        setStatus,
        loading,
        setLoading,
        earned,
        setEarned,
        timestamp,
        setTimestamp,
        getParticipantStatus,
        coinBalance,
        setCoinBalance,
        getCoinBalance,
        winStreak,
        setWinStreak,
    }
}
