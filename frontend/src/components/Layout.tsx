import React from "react";
import Header from "./Header";
import {Helmet} from "react-helmet";

const Layout: React.FC = ({ children }) => {
    return <div className="osi-frame">
        <Helmet>
            <html lang="ja"/>
            <title>CASTRA Quest</title>
        </Helmet>
        <Header />
        <section className="section">
            { children }
        </section>
    </div>
}

export default Layout;
