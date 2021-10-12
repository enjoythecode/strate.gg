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