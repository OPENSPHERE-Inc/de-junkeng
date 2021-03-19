import React from "react";
import Layout from "../components/Layout";
import Playground from "../components/Playground";
import {MatchContext, useMatch} from "../components/Match";
import withHardhat from "../components/Hardhat";

const Dashboard = () => {
    const match = useMatch();

    return <MatchContext.Provider value={match}>
        <Layout>
            <div className="container is-max-desktop">
                <div className="content">
                    <Playground />
                </div>
            </div>
        </Layout>
    </MatchContext.Provider>
}

export default withHardhat(Dashboard);
