import { makeObservable, observable, computed, action, flow } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import {Amazons, AmazonsView} from "./Games/Amazons"

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
        })
        this.game_name = game_name
        this.game_state = new Amazons({"size": 6, "variation":0})
        console.log("testing", game_name)
    }
}

const ChallengeView = observer(({ challenge }) =>(
    <div>
    <h1>this is challenge view!</h1>
    <div>{challenge != null ? "game of " + challenge.game_name : "Loading game!"}</div>
    <AmazonsView challenge ={challenge}/>
    </div>
))

export {Challenge, ChallengeView}