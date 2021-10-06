import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import TodoListView from './TodoApp';
import App from './App.js'

import State from './State.js'
import Socket from './Socket.js'

const state = new State()
const socket = new Socket(state)
state.set_socket(socket)
socket.connect()

ReactDOM.render(
  <React.StrictMode>
    <App state={state}/>
  </React.StrictMode>,
  document.getElementById('root')
);