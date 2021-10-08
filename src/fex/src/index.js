import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import App from './App.js'
import PlayPage from "./PlayPage.js"

import State from './State.js'
import Socket from './Socket.js'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { autorun } from "mobx"

const state = new State()
const socket = new Socket(state)
state.set_socket(socket)
autorun(() => {
  console.log("Number of challenges", Object.keys(state.challenges).length)
})
socket.connect()

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/play/:gameName">
          <PlayPage state={state} />
        </Route>
        <Route path="/">
          <App state={state}/>
        </Route>
      </Switch>
    </Router>

    <div style={{position:'absolute', top:'0', right:'0'}}>
      You're {state.connection_status}. 
      <b> {state.active_users}</b> online users!
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);