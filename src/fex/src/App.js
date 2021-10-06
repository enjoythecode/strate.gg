import { observer } from "mobx-react"
import React from "react"
//import { AbstractGameState } from "./AbstractGameState"

const App = observer(({ state }) =>(
    <div>
        <h1>Hello, world!</h1>
        <div style={{position:'absolute', top:'0', right:'0'}}>
            You're {state.connection_status}. 
            <b> {state.active_users}</b> online users!
        </div>
    </div>
))

export default App