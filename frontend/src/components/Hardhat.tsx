import React from "react";
import { Symfoni } from "../hardhat/SymfoniContext";


const withHardhat = (Component: React.FC) => (props: any) => {
    return <Symfoni autoInit={true} >
        <Component {...props} />
    </Symfoni>
}

export default withHardhat;
