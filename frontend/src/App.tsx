import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
    return <BrowserRouter>
        <Switch>
            <Route path="/" component={Dashboard} />
        </Switch>
    </BrowserRouter>
}

export default App;
