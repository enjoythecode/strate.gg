import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import PlayPage from "./PlayPage.js";
import RootState from "./RootStore.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header, Footer } from "./MainPurposeComponents";

RootState.socket.connect();

ReactDOM.render(
  <React.StrictMode>
    <Header />

    <Router>
      <Switch>
        <Route path="/play/:gameName">
          <PlayPage state={RootState} />
        </Route>
        <Route path="/">
          <App state={RootState} />
        </Route>
      </Switch>
    </Router>

    <Footer />
  </React.StrictMode>,
  document.getElementById("root")
);
