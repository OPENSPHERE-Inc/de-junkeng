import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import {JunkengContext} from "../hardhat/SymfoniContext";
import {lookupTable, MatchContext, ParticipantStatus} from "./Match";

const Header = () => {
    const junkeng = useContext(JunkengContext);
    const [isActive, setActive] = useState(false);
    const match = useContext(MatchContext);

    const toggleHamburger = () => {
        setActive(!isActive);
    }

    const withdraw = async () => {
        await junkeng.instance?.withdraw()
            .then(() => {
                // FIXME: Reload browser after withdraw click, the coin balance appears again until tx is accepted.
                match.setCoinBalance('0');
            })
            .catch(console.error)
    }

    return <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <Link to="/" className="navbar-item">
                DeJunkeng
            </Link>

            <a role="button" className={`navbar-burger ${isActive ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false"
               data-target="navbarMain"
                onClick={() => toggleHamburger()}>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarMain" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
            <div className="navbar-start">
                <Link to="/" className="navbar-item">
                    Play
                </Link>
            </div>

            <div className="navbar-end">
                <div className="navbar-item">
                    <span className="icon">
                        <i className="fas fa-medal"></i>
                    </span>
                    <span>Win streak: {match.winStreak}</span>
                </div>
                <div className="navbar-item">
                    <span className="icon">
                        <i className="fas fa-coins"></i>
                    </span>
                    <span>JunkCoin: {match.coinBalance} JKC</span>
                </div>
                <div className="navbar-item">
                    <div className="buttons">
                        <button className="button" disabled={match.coinBalance === '0'} onClick={withdraw}>
                            Withdraw
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
}

export default Header;
