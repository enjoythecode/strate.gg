import { makeObservable, observable, action, computed } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import {Amazons, AmazonsView} from "./Games/Amazons"
import RootState  from "./State.js"

class Challenge {
    game_name = ""
    game_state = null
    players = []
    status = ""
    cid = ""
    moves = []
    
    constructor(cid, game_name){
        makeObservable(this, {
            game_state: observable,
            players: observable,
            status: observable,
            update_challenge_information: action,
            client_turn: computed
        })
        this.cid = cid
        this.game_name = game_name
        this.game_state = new Amazons(this, {"size": 6, "variation":0})
    }

    send_move(move){
        RootState.socket.send_move({"cid": this.cid, "move": move})
    }

    process_new_move(move){
        this.game_state.process_new_move(move)
        this.moves.push(move)
    }

    update_challenge_information(data){
        if("status" in data){this.status = data.status}
        if("players" in data){this.players = data.players}
        if("cid" in data){this.cid = data.cid}
    }

    get client_turn(){ // 0-indexed player turn (ie. 1st player = 0, 2nd player = 1, ...) -1 if not a player
        return this.players.findIndex((player) => player === RootState.socket.socket_id)
    }
}

const ChallengeView = observer(({ challenge }) =>(
    <div>
        {
            challenge == null ? 
                "Loading the game!" :
                <div>
                    <p>{challenge.status}</p>
                    <p>Players: {challenge.players.join(", ")}</p>
                    <AmazonsView challenge={challenge}/>
                </div>
        }
    </div>
))

export {Challenge, ChallengeView}