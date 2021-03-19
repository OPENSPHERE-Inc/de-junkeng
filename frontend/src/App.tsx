import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Play from "./pages/Play";
import Dashboard from "./pages/Dashboard";

function App() {
    return <BrowserRouter>
        <Switch>
            <Route path="/play" component={Play} />
            <Route path="/" component={Dashboard} />
        </Switch>
    </BrowserRouter>
}

export default App;
