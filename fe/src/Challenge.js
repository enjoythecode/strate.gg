import { makeObservable, observable, action, computed } from "mobx"
import {Amazons, AmazonsView} from "./Games/Amazons"
import {Mancala, MancalaView} from "./Games/Mancala"
import { observer } from "mobx-react"
import RootState  from "./State.js"
import React from "react"

const game_name_to_state_class = {
    "amazons": Amazons,
    "mancala": Mancala
}

const game_name_to_view_component = {
    "amazons": AmazonsView,
    "mancala": MancalaView
}


class Challenge {
    game_name = ""
    game_state = null
    players = []
    status = ""
    cid = ""
    moves = []
    
    constructor(data){
        makeObservable(this, {
            game_state: observable,
            players: observable,
            status: observable,
            update_challenge_information: action,
            client_turn: computed
        })
        this.cid = data.cid
        this.game_name = data.game_name
        this.game_state = new game_name_to_state_class[this.game_name](this, data.config)
        this.ViewComponent = game_name_to_view_component[this.game_name]
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

    get client_turn(){ // 0-indexed player turn (ie. 1st player = 0, 2nd player = 1, ...), -1 if not a player
        return this.players.findIndex((player) => player === RootState.socket.socket_id)
    }
}

const PlayerTagView = (props) => {

    let classes = ["player-tag"]
    if (props.isSelf){
        classes.push("player-tag-self")
    }

    let display;
    if(typeof props.displayName !== 'undefined'){
        console.log("dn", props.displayName)
        display = "Anon#" + props.displayName.slice(0, 7)
    }else{
        display = "Waiting for opponent..."
    }

    return (
        <div>
            <span className={classes.join(" ")}>{display}</span>
        </div>
    )
}


const ChallengeView = observer(({ challenge }) =>(
    <div>
        {
        challenge == null ? "Loading the game!" :
            <div>
                <div className="challenge-wrapper">
                    <div className="challenge-board">
                        <challenge.ViewComponent game_state={challenge.game_state}/>
                    </div>
                    <div className="challenge-dashboard">
                        <div>
                            <PlayerTagView displayName={challenge.players[1]} isSelf={challenge.client_turn == 1}/>
                            <h3>Move List</h3>
                            <h4>Status: {challenge.status}</h4>
                            <PlayerTagView displayName={challenge.players[0]} isSelf={challenge.client_turn == 0}/>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
))

export {Challenge, ChallengeView}