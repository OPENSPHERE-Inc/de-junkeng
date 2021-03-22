import React from "react";
import Header from "./Header";
import {Helmet} from "react-helmet";
import Footer from "./Footer";

const Layout: React.FC = ({ children }) => {
    return <div className="osi-frame">
        <Helmet>
            <html lang="ja"/>
            <title>DeJunkeng</title>
        </Helmet>
        <Header />
        <section className="section">
            { children }
        </section>
        <Footer />
    </div>
}

export default Layout;
