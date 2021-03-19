import React, {useContext, useState} from "react";
import {JunkengContext} from "../hardhat/SymfoniContext";
import {useInterval} from "./Interval";
import moment from "moment";
import 'moment-duration-format';
import {lookupTable, MatchContext, MatchStatus, ParticipantStatus} from "./Match";


const MatchNumber = () => {
    const match = useContext(MatchContext);

    return <p>Match #{Math.floor(match.participant.index / 2) + 1}</p>
}

const PreMatch = () => {
    const junkeng = useContext(JunkengContext);
    const match = useContext(MatchContext);

    const join = () => {
        junkeng.instance?.join()
            .then(() => {
                match.setParticipant({
                    ...match.participant,
                    status: ParticipantStatus.PARTICIPATED,
                    transient: true,  // State is transient (off-chain only)
                })
                match.setOpponent({
                    ...match.opponent,
                    status: ParticipantStatus.NOT_PARTICIPATE,
                    transient: true,  // State is transient (off-chain only)
                })
                match.setStatus(MatchStatus.PREMATCH);
                console.debug('PREMATCH');
            })
            .catch((e) => {
                console.error(e);
            })
    }

    return <>
        <div className="columns">
            <div className="column is-three-fifths is-offset-one-fifth">
                <button className="button is-primary is-large is-fullwidth" onClick={join}
                        disabled={match.participant.status === ParticipantStatus.PARTICIPATED}>
                    Join match
                </button>
            </div>
        </div>

        { match.participant.status === ParticipantStatus.PARTICIPATED
            ? <p className="has-text-centered">Wait for opponent...</p> : null }
    </>
}

const Established = () => {
    const junkeng = useContext(JunkengContext);
    const match = useContext(MatchContext);
    const [remain, setRemain] = useState<number | null>(null);

    const disclose = (handShape: number) => {
        junkeng.instance?.disclose(handShape)
            .then(() => {
                match.setParticipant({
                    ...match.participant,
                    handShape: handShape,
                    status: ParticipantStatus.DISCLOSED,
                    transient: true,  // State is transient (off-chain only)
                })
            })
            .catch((e) => {
                console.error(e);
            })
    }

    // Execute every 1 sec
    useInterval(async () => {
        if (match.timestamp > 0) {
            const msecs = 5 * 60 * 1000 - (moment().valueOf() - match.timestamp);
            setRemain(msecs);
            if (msecs < -1000) {
                // Time up
                // FIXME: Disclose at the last minute, possibly different result is displayed. (Caused by delayed tx acceptance)
                match.getParticipantStatus()
                    .then(() => {
                        match.setStatus(MatchStatus.SETTLED);
                        console.debug('SETTLED (Time up)');
                    })
            }
        }
    }, 1000);

    const ProgressBar = () => {
        const percent = (remain || 0) / (5 * 60 * 1000) * 100;
        return <>
            <progress className={`progress is-large mb-1 ${percent > 50 ? 'is-primary' : percent > 20 ? 'is-warning' : 'is-danger'}`}
                      value={percent} max="100">
                { percent }%
            </progress>
            <div className="block has-text-centered">
                { remain && remain > 0 ? moment.duration(remain).format('d[d ]hh:mm:ss') : <>&nbsp;</> }
            </div>
        </>
    }

    return <>
        <div className="block">
            <MatchNumber />
        </div>

        <div className="block">
            Please choose your hand shape to disclose
        </div>

        <ProgressBar />

        <div className="block">
            <div className="columns">
                <div className="column">
                    <button className={`button is-rounded is-large is-fullwidth ${match.participant.handShape === 1 ? 'is-success' : ''}`}
                            onClick={() => disclose(1)}
                            disabled={match.participant.status === ParticipantStatus.DISCLOSED}>
                        <span>Guu</span>
                        <span className="icon">
                            <i className="far fa-hand-rock"></i>
                        </span>
                    </button>
                </div>
                <div className="column">
                    <button className={`button is-rounded is-large is-fullwidth ${match.participant.handShape === 2 ? 'is-success' : ''}`}
                            onClick={() => disclose(2)}
                            disabled={match.participant.status === ParticipantStatus.DISCLOSED}>
                        <span>Choki</span>
                        <span className="icon">
                            <i className="far fa-hand-scissors"></i>
                        </span>
                    </button>
                </div>
                <div className="column">
                    <button className={`button is-rounded is-large is-fullwidth ${match.participant.handShape === 3 ? 'is-success' : ''}`}
                            onClick={() => disclose(3)}
                            disabled={match.participant.status === ParticipantStatus.DISCLOSED}>
                        <span>Paa</span>
                        <span className="icon">
                            <i className="far fa-hand-paper"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>

        { match.participant.status === ParticipantStatus.DISCLOSED
            ? <div className="block has-text-centered">Wait for opponent...</div> : null }
    </>
}

const Settled = () => {
    const match = useContext(MatchContext);

    const Result = () => {
        const result = lookupTable[match.participant.handShape][match.opponent.handShape];
        switch (result) {
            case 1:
                return <div className="block has-text-weight-bold is-size-1 has-text-centered has-text-success">
                    You won !
                </div>
            case -1:
                return <div className="block has-text-weight-bold is-size-1 has-text-centered has-text-danger">
                    You lost...
                </div>
            case 0:
            default:
                return <div className="block has-text-weight-bold is-size-1 has-text-centered has-text-warning">
                    Drew
                </div>
        }
    }

    const HandShape = ({handShape}: {handShape: number}) => {
        switch (handShape) {
            case 0:
                return <>
                    <div>
                        <span className="icon is-large">
                            <i className="fas fa-hourglass-end fa-2x"></i>
                        </span>
                    </div>
                    <div>Timeout</div>
                </>
            case 1:
                return <>
                    <div>
                        <span className="icon is-large">
                            <i className="far fa-hand-rock fa-2x"></i>
                        </span>
                    </div>
                    <div>Guu</div>
                </>
            case 2:
                return <>
                    <div>
                        <span className="icon is-large">
                            <i className="far fa-hand-scissors fa-2x"></i>
                        </span>
                    </div>
                    <div>Choki</div>
                </>
            case 3:
                return <>
                    <div>
                        <span className="icon is-large">
                            <i className="far fa-hand-paper fa-2x"></i>
                        </span>
                    </div>
                    <div>Paa</div>
                </>
            default:
                return null;
        }
    }

    return <>
        <MatchNumber />

        <article className="message is-success">
            <div className="message-header">
                Result
            </div>
            <div className="message-body">
                <div className="columns is-mobile">
                    <div className="column has-text-centered">
                        <div className="block has-text-weight-bold">You</div>
                        <div className="block"><HandShape handShape={match.participant.handShape} /></div>
                    </div>
                    <div className="column has-text-centered">
                        { match.participant.handShape > 0
                            ? <>
                                <div className="block has-text-weight-bold">Opponent</div>
                                <div className="block"><HandShape handShape={match.opponent.handShape} /></div>
                            </>
                            : null
                        }
                    </div>
                </div>

                <Result />

                { match.earned > 0
                    ? <div className="block has-text-centered has-text-weight-bold">You earned {match.earned} JKC !</div> : null }
            </div>
        </article>

        <PreMatch/>
    </>
}

const Playground = () => {
    const match = useContext(MatchContext);

    if (match.loading) {
        return <></>
    }

    switch (match.status) {
        case MatchStatus.PREMATCH:
        default:
            return <PreMatch />
        case MatchStatus.ESTABLISHED:
            return <Established />
        case MatchStatus.SETTLED:
            return <Settled />
    }
}

export default Playground;
