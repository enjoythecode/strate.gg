import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import {Amazons, AmazonsView} from "./Games/Amazons"
import RootState  from "./State.js"

class Challenge {
    game_name = ""
    game_state = null
    players = []
    turn = 0
    status = ""
    resolution = ""
    cid = ""
    moves = []
    
    constructor(cid, game_name){
        makeObservable(this, {
            game_state: observable,
            players: observable,
            turn: observable,
            status: observable,
            resolution: observable,
        })
        this.cid = cid
        this.game_name = game_name
        this.game_state = new Amazons(this, {"size": 6, "variation":0})
        console.log("testing", game_name)
    }

    send_move(move){
        RootState.socket.send_move({"cid": this.cid, "move": move})
    }

    process_new_move(move){
        this.game_state.process_new_move(move)
        this.moves.push(move)
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