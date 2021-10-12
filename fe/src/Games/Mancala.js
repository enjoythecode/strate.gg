import { makeObservable, computed, observable, action } from "mobx"
import { observer } from "mobx-react"
import React from "react"

const initializeBoard = () => {
    return {
        pits: [
            [4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4]
        ],
        banks: [0, 0]
    }
}

class Mancala {
    constructor(challenge, config){
        makeObservable(this,{
            board: observable,
            clickPit: action,
            process_new_move: action,
        })
        this.turn = 1
        this.config = config
        this.challenge = challenge
        this.board = initializeBoard(config)
    }

    board = null

    clickPit = (p) => {
        // check if it is the players turn before allowing a click
        // also checks for observers because client_turn == -1 if the client is not a player
        //if(this.turn === this.challenge.client_turn + 1 && this.challenge.status === "IN_PROGRESS"){
            this.challenge.send_move({"pit": p})
        //} 
    }

    process_new_move(move){
        // TODO: implement
        console.log("TODO: implement processing moves!", move)

        this.turn = 3 - this.turn
    }
}

const MancalaView = observer(class _ extends React.Component{
    render() {
        let pits = []

        for(let k = 0; k < 6; k ++){
            pits.push(<div   
                key={k}
                onClick={this.props.challenge.game_state.clickPit.bind(null, k)}>
                    Pit {k}
            </div>)
        }

        if(this.props.challenge != null){
            return (
                <div>
                    <h4>
                        Mancala!
                    </h4>
                    <div style={{"height": "300px"}}>
                            {JSON.stringify(this.props.challenge.game_state.board)}
                            <hr/>
                            {pits}
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <p>Loading Challenge</p>
                </div>
            )
        }
    }
})

export {Mancala, MancalaView}