import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js'
import PlayPage from "./PlayPage.js"
import RootState from './State.js'
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
    <div style={{position:'absolute', top:'0', right:'0'}}>
      You're {RootState.connection_status}. 
      <b> {RootState.active_users}</b> online users!
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);