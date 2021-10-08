import { makeObservable, observable, computed, action, flow } from "mobx"
import { observer } from "mobx-react"
import React from "react"

class Challenge {
    game_name = ""
    game_state = null
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

const ChallengeView = observer(({ challenge }) =>(
    <div>
        <h1>Hello, challenge view!</h1>
        <div>{challenge != null ? "game of" + challenge.game_name : "Loading game!"}</div>

    </div>
))

export {Challenge, ChallengeView}