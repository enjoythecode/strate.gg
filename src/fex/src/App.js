import { observer } from "mobx-react"
import React from "react"

const App = observer(({ state }) =>(
    <div>
        <h1>Hello, world!</h1>
        <h2>Play Amazons!</h2>
        <button onClick={() => {state.socket.create_new_game({game_name: "amazons", config: {"size":6, "variation":0}})}}>Start a 6x6 game, normal variation</button>
    </div>
))

export default App