import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import ChallengePlayPage from "./Challenge/ChallengePlayPage.js";
import {
  initRootStoreAndSocket,
  RootStoreProvider,
} from "./Store/RootStore.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

const RootStore = initRootStoreAndSocket();
RootStore.socket.connect();

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Container fixed sx={{ bgcolor: "background.paper" }}>
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
    </Container>
  </React.StrictMode>,
  document.getElementById("root")
);
