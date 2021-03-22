import React from "react";

const Footer = () => {

    return <footer className="footer">
        <div className="container is-max-desktop">
            <div className="content has-text-centered">
                <p>
                    Copyright &copy; {(new Date()).getFullYear()} &nbsp;
                    <a href="https://www.opensphere.co.jp/">OPENSPHERE Inc.</a>
                </p>
            </div>
        </div>
    </footer>
}

export default Footer;
