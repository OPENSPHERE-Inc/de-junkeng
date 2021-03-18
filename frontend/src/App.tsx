import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { ToastProvider } from 'react-toast-notifications'

function App() {
    return <ToastProvider>
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Dashboard} />
            </Switch>
        </BrowserRouter>
    </ToastProvider>
}

export default App;
