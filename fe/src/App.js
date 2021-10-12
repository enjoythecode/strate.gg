import { observer } from "mobx-react"
import React from "react"
import Tv from "./Tv.js"

const App = observer(({ state }) =>(
    <div>
        <h2>Play Amazons!</h2>
        <button onClick={() => {state.socket.create_new_game({game_name: "amazons", config: {"size":6, "variation":0}})}}>Start a 6x6 game, normal variation</button>
        <Tv/>
    </div>
))

export default App