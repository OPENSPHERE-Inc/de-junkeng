import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {CurrentAddressContext, JunkengContext} from "../hardhat/SymfoniContext";
import moment from "moment";
import {BigNumber} from "ethers";
import {useToasts} from "react-toast-notifications";


export enum MatchStatus {
    PREMATCH,
    ESTABLISHED,
    SETTLED,
}

export enum ParticipantStatus {
    NOT_PARTICIPATE,
    PARTICIPATED,
    DISCLOSED,
}

export interface ParticipantState {
    index: number,
    addr: string,
    status: ParticipantStatus,
    handShape: number,
    timestamp :number,
    streak: number,
}

export const defaultParticipantState: ParticipantState = {
    index: 0,
    addr: '',
    status: ParticipantStatus.NOT_PARTICIPATE,
    handShape: 0,
    timestamp: 0,
    streak: 0,
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
}

export const defaultMatchContextStore: MatchContextStore = {
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
    setCoinBalance: (value: string) => {},
    getCoinBalance: async () => '0',
}


export const MatchContext = createContext<MatchContextStore>(defaultMatchContextStore);

export const useMatch = (): MatchContextStore => {
    const [status, setStatus] = useState(MatchStatus.PREMATCH);
    const [participant, setParticipant] = useState<ParticipantState>(defaultParticipantState);
    const [opponent, setOpponent] = useState<ParticipantState>(defaultParticipantState);
    const [loading, setLoading] = useState(true);
    const [earned, setEarned] = useState(0);
    const [timestamp, setTimestamp] = useState(0);
    const [coinBalance, setCoinBalance] = useState('0');

    // Local usage
    const junkeng = useContext(JunkengContext);
    const [currentAddress] = useContext(CurrentAddressContext);
    const { addToast } = useToasts();

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

    const getParticipantStatus = useCallback(async () => {
        if (!junkeng.instance) {
            return { participant: defaultParticipantState, opponent: defaultParticipantState }
        }

        const participant = await junkeng.instance.getStatus()
            .then((result): ParticipantState => {
                return {
                    index: result.index.toNumber(),
                    status: result.status,
                    handShape: result.handShape,
                    addr: result.addr,
                    timestamp: result.timestamp.toNumber(),
                    streak: result.streak.toNumber(),
                }
            })
            .catch((e) => {
                return defaultParticipantState;
            })
        console.debug('Participant', participant);

        const opponent = await junkeng.instance.getOpponentStatus()
            .then((result): ParticipantState => {
                return {
                    index: result.index.toNumber(),
                    status: result.status,
                    handShape: result.handShape,
                    addr: result.addr,
                    timestamp: result.timestamp.toNumber(),
                    streak: result.streak.toNumber(),
                }
            })
            .catch((e) => {
                return defaultParticipantState;
            })
        console.debug('Opponent', opponent);

        // Always query coin balance
        await getCoinBalance();

        // Update timestamp
        const timestamp = Math.max(participant.timestamp, opponent.timestamp);
        setTimestamp(timestamp * 1000);  // Unix secs -> msecs

        // Keep deadline
        if (timestamp > 0) {
            const duration = moment().unix() - timestamp;
            if (duration > 5 * 60) {
                participant.status = ParticipantStatus.DISCLOSED;
                opponent.status = ParticipantStatus.DISCLOSED;
            }
        }

        setParticipant(participant);
        setOpponent(opponent);

        return { participant, opponent };
    }, [junkeng.instance]);



    useEffect(() => {
        if (!junkeng.instance) {
            return;
        }

        getParticipantStatus()
            .then(({participant, opponent}) => {
                if (participant.status === ParticipantStatus.DISCLOSED && opponent.status === ParticipantStatus.DISCLOSED) {
                    setStatus(MatchStatus.SETTLED);
                    console.debug('SETTLED');
                } else if (participant.status >= ParticipantStatus.PARTICIPATED && opponent.status >= ParticipantStatus.PARTICIPATED) {
                    setStatus(MatchStatus.ESTABLISHED);
                    console.debug('ESTABLISHED');
                } else {
                    setStatus(MatchStatus.PREMATCH);
                    console.debug('PREMATCH');
                }

                setLoading(false);
            })
            .catch(console.error)

    }, [junkeng.instance, currentAddress])

    useEffect(() => {
        if (!junkeng.instance) {
            return;
        }
        const instance = junkeng.instance;

        const joinedHandler = async (addr: string, index: BigNumber) => {
            if (addr === currentAddress) {
                setStatus(MatchStatus.PREMATCH);
                console.debug('PREMATCH');
                setParticipant({
                    ...participant,
                    index: index.toNumber(),
                    status: ParticipantStatus.PARTICIPATED,
                    addr: addr,
                    timestamp: 0,
                    handShape: 0,
                })
            }
        }

        const establishedHandler = async (
            a: string, a_index: BigNumber, b: string, b_index: BigNumber, timestamp: BigNumber
        ) => {
            if (currentAddress === a || currentAddress === b) {
                setStatus(MatchStatus.ESTABLISHED);
                console.debug('ESTABLISHED');
                setTimestamp(timestamp.toNumber() * 1000);  // Unix secs -> msecs
                await getParticipantStatus();
            }
        }

        const disclosedHandler = async (addr: string, index: BigNumber) => {
            if (currentAddress === addr) {
                setStatus(MatchStatus.ESTABLISHED);
                console.debug('ESTABLISHED');
                await getParticipantStatus();
            }
        }

        const settledHandler = async (
            a: string, a_index: BigNumber, a_handShape: number, b: string, b_index: BigNumber, b_handShape: number
        ) => {
            if (currentAddress === a || currentAddress === b) {
                setStatus(MatchStatus.SETTLED);
                console.debug('SETTLED');
                setTimestamp(0);
                setParticipant({
                    ...participant,
                    handShape: currentAddress === a ? a_handShape : b_handShape,
                    status: ParticipantStatus.DISCLOSED,
                })
                setOpponent({
                    ...opponent,
                    handShape: currentAddress === a ? b_handShape : a_handShape,
                    status: ParticipantStatus.DISCLOSED,
                })
            }
        }

        const earnedHandler = async (addr: string, index: BigNumber, amount: BigNumber) => {
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
    }, [junkeng.instance, currentAddress])

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
        getCoinBalance
    }
}
