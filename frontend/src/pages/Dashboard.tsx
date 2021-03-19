import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Dashboard = () => {
    return <Layout>
        <div className="container is-max-desktop">
            <div className="content">
                <div className="columns">
                    <div className="column is-three-fifths is-offset-one-fifth">
                        <img src="/janken_boys.png" width="100%" />
                    </div>
                </div>


                <article className="message is-warning">
                    <div className="message-body">
                        To play, required installing <a href="https://metamask.io/">MetaMask</a> and connect Rinkeby Test Network.
                        Also need some ETHs for your commitment of transaction. (Grab free ETHs <a href="https://faucet.rinkeby.io/">here</a>)
                    </div>
                </article>

                <div className="buttons is-grouped is-centered">
                    <Link to="/play" className="button is-primary is-large">Connect MetaMask</Link>
                </div>
            </div>
        </div>
    </Layout>
}

export default Dashboard;
