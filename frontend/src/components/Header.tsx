import React, {useState} from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [isActive, setActive] = useState(false);

    const toggleHamburger = () => {
        setActive(!isActive);
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
        </div>
    </nav>
}

export default Header;
