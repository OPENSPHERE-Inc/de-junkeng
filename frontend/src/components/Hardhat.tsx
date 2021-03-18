import React from "react";
import { Symfoni } from "../hardhat/SymfoniContext";


const withHardhat = (Component: React.FC) => () => {
    return <Symfoni autoInit={true}>
        <Component />
    </Symfoni>
}

export default withHardhat;
