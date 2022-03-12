import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import ChallengePlayPage from "./Challenge/ChallengePlayPage.js";
import {
  initRootStoreAndSocket,
  RootStoreProvider,
} from "./Store/RootStore.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header, Footer } from "./Components/MainPurposeComponents";
import "./index.css";

const RootStore = initRootStoreAndSocket();
RootStore.socket.connect();

ReactDOM.render(
  <React.StrictMode>
    <RootStoreProvider store={RootStore}>
      <Header />

      <Router>
        <Switch>
          <Route path="/play/:gameName">
            <ChallengePlayPage />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Router>

      <Footer />
    </RootStoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
