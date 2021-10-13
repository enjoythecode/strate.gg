import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js'
import PlayPage from "./PlayPage.js"
import RootState from './State.js'
import ConnectionWidget from "./ConnectionWidget.js"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

RootState.socket.connect()

ReactDOM.render(
  <React.StrictMode>

  <div class="mancala-board">
    <div class="mancala-pit mancala-pit-d-1"></div>
    <div class="mancala-pit mancala-pit-d-2"></div>
    <div class="mancala-pit mancala-pit-d-3"></div>
    <div class="mancala-pit mancala-pit-d-4"></div>
    <div class="mancala-pit mancala-pit-d-5"></div>
    <div class="mancala-pit mancala-pit-d-6"></div>
    <div class="mancala-bank-r"></div>

    <div class="mancala-pit mancala-pit-u-1"></div>
    <div class="mancala-pit mancala-pit-u-2"></div>
    <div class="mancala-pit mancala-pit-u-3"></div>
    <div class="mancala-pit mancala-pit-u-4"></div>
    <div class="mancala-pit mancala-pit-u-5"></div>
    <div class="mancala-pit mancala-pit-u-6"></div>
    <div class="mancala-bank-l"></div>
    <div class="mancala-pebble-container">
        <div class="mancala-pebble mancala-pebble-1"></div>
    </div>
  </div>
    <Router>
      <Switch>
        <Route path="/play/:gameName">
          <PlayPage state={RootState} />
        </Route>
        <Route path="/">
          <App state={RootState}/>
        </Route>
      </Switch>
    </Router>
    <ConnectionWidget/>


  </React.StrictMode>,
  document.getElementById('root')
);