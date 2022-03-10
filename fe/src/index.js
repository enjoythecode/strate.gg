import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import ChallengePlayPage from "./Challenge/ChallengePlayPage.js";
import RootStore from "./Store/RootStore.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header, Footer } from "./Components/MainPurposeComponents";
import "./index.css";

RootStore.socket.connect();

ReactDOM.render(
  <React.StrictMode>
    <Header />

    <Router>
      <Switch>
        <Route path="/play/:gameName">
          <ChallengePlayPage state={RootStore} />
        </Route>
        <Route path="/">
          <App state={RootStore} />
        </Route>
      </Switch>
    </Router>

    <Footer />
  </React.StrictMode>,
  document.getElementById("root")
);
