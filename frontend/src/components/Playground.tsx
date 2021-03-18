import React, {useContext, useState} from "react";
import {JunkengContext} from "../hardhat/SymfoniContext";
import {useInterval} from "./Interval";
import moment from "moment";
import 'moment-duration-format';
import {MatchContext, MatchStatus, ParticipantStatus} from "./Match";


const lookupTable = [
    [ -1, -1, -1, -1 ],
    [  1,  0,  1, -1 ],
    [  1, -1,  0,  1 ],
    [  1,  1, -1,  0 ],
];

const handShapes = ['Timeout', 'Guu', 'Choki', 'Paa']


const PreMatch = () => {
    const junkeng = useContext(JunkengContext);
    const match = useContext(MatchContext);

    const join = () => {
        junkeng.instance?.join()
            .then(() => {
                match.setParticipant({
                    ...match.participant,
                    status: ParticipantStatus.PARTICIPATED,
                })
            })
            .catch((e) => {
                console.error(e);
            })
    }

    return <>
        <h1 className="title is-3">Click "Join match" to play DeJunkeng.</h1>

        { match.participant.status !== ParticipantStatus.PARTICIPATED
            ? <div className="buttons is-grouped is-grouped-centered">
                <button className="button is-primary is-large" onClick={join}>Join match</button>
            </div>
            : <p>Wait for opponent...</p>
        }
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
                })
            })
            .catch((e) => {
                console.error(e);
            })
    }

    useInterval(async () => {
        if (match.timestamp > 0) {
            const msecs = 5 * 60 * 1000 - (moment().valueOf() - match.timestamp);
            setRemain(msecs);
            if (msecs < -3) {
                // Time up
                match.getParticipantStatus()
                    .then(() => {
                        match.setStatus(MatchStatus.SETTLED);
                        console.debug('SETTLED (Time up)');
                    })
            }
        }
    }, 1000);

    return <>
        <h1 className="title is-3">Choose your hand shape to disclose.</h1>

        <p>Match #{Math.floor(match.participant.index / 2) + 1}</p>

        { remain && (remain > 0
            ? <p>Time remaining: { moment.duration(remain).format('d[d ]hh:mm:ss') }</p>
            : <p>Time up !</p>)
        }
        { match.participant.status !== ParticipantStatus.DISCLOSED
            ? <div className="buttons is-grouped is-grouped-centered">
                <button className="button is-rounded is-large" onClick={() => disclose(1)}>
                    <span>Guu</span>
                    <span className="icon">
                        <i className="far fa-hand-rock"></i>
                    </span>
                </button>
                <button className="button is-rounded is-large" onClick={() => disclose(2)}>
                    <span>Choki</span>
                    <span className="icon">
                        <i className="far fa-hand-scissors"></i>
                    </span>
                </button>
                <button className="button is-rounded is-large" onClick={() => disclose(3)}>
                    <span>Paa</span>
                    <span className="icon">
                        <i className="far fa-hand-paper"></i>
                    </span>
                </button>
            </div>
            : <p>Your choice is { handShapes[match.participant.handShape] }, Wait for opponent...</p>
        }
    </>
}

const Settled = () => {
    const match = useContext(MatchContext);

    const result = lookupTable[match.participant.handShape][match.opponent.handShape];

    const displayResult = () => {
        switch (result) {
            case 1:
                return "You won !";
            case -1:
                return "You lost...";
            case 0:
            default:
                return "Drew";
        }
    }

    return <>
        <h1 className="title is-3">Jung Keng Pong !</h1>

        <p>Match #{Math.floor(match.participant.index / 2) + 1}</p>

        <p>Your hand shape: {handShapes[match.participant.handShape]}</p>
        { match.participant.handShape > 0
            ? <p>Opponent hand shape: {handShapes[match.opponent.handShape]} </p>
            : null
        }
        <p className="has-text-weight-bold is-size-4">{displayResult()}</p>

        { match.earned > 0 ? <p>You earned {match.earned} JKC !</p> : null }

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
