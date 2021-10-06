import { makeObservable, observable, computed, action, flow } from "mobx"
import { observer } from "mobx-react"
import React from "react"
//import { AbstractGameState } from "./AbstractGameState"

class Challenge {
    game_name = ""
    game_state = ""
    players = []
    turn = 0
    status = ""
    resolution = ""
    
    constructor(game_name){
        makeObservable(this, {
            game_state: observable,
            players: observable,
            turn: observable,
            status: observable,
            resolution: observable,

            //sckt_move_update: action,
            //sckt_meta_update: action,
        })
        this.game_name = game_name
        console.log("testing", game_name)
    }
}

const ChallengeView = observer(({ state }) =>(
    <div>
        <h1>Hello, world!</h1>
        <div style={{position:'absolute', top:'0', right:'0'}}>{state.active_users} online users!</div>
    </div>
))

const chall = new Challenge("amazons") 
//const ChallengeApp = () => (<ChallengeView Challenge={chall} />)

export default ChallengeView