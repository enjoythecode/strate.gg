import { makeObservable, computed, observable, action, toJS } from "mobx"
import { observer } from "mobx-react"
import React from "react"

const initializeBoard = () => {
    return [
            4, 4, 4, 4, 4, 4, 0,
            4, 4, 4, 4, 4, 4, 0
        ]
        
        /* INDICES MAPPING TO BOARD 
        *  P2:  13, 12, 11, 10, 9, 8, 7
        *  P1:       0,  1,  2, 3, 4, 5, 6,
        */
}

const BANKS = [6, 13] // Banks[i] == Index of bank of player i

class Mancala {
    constructor(challenge, config){
        makeObservable(this,{
            board: observable,
            clickPit: action,
            process_new_move: action,
        })
        this.turn = 0
        this.config = config
        this.challenge = challenge
        this.board = initializeBoard(config)
    }

    board = null

    clickPit = (p) => {
        // check if it is the players turn before allowing a click
        // also checks for observers because client_turn == -1 if the client is not a player
        // TODO
        //if(this.turn === this.challenge.client_turn + 1 && this.challenge.status === "IN_PROGRESS"){
            this.challenge.send_move({"pit": p})
        //} 
    }

    process_new_move(move){
        let ptr = move["pit"] + this.turn * 7

        let seeds = this.board[ptr]
        let next_plyr = (this.turn + 1) % 2

        this.board[ptr] = 0
        while(seeds > 0){
            ptr += 1
            ptr = ptr % 14 // wrap around the board!

            if (ptr === BANKS[next_plyr]){ // rival bank
                continue
            }else{
                this.board[ptr] += 1
                seeds -=1
            }
        }

        // check for capture 
        // (ruleset: capture happens when landing on empty pit on friendly side)
        if (0 <= ptr - 7 * this.turn && ptr - 7 * this.turn <= 5 && this.board[ptr] === 1){
            let capture = 0
            for(let i of [ptr, 12 - ptr]){
                capture += this.board[i]
                this.board[i] = 0
            }
            this.board[BANKS[this.turn]] += capture
        }

        // advance the round to the next player if landed outside self-bank.
        if (ptr !== BANKS[this.turn]){
            this.turn = next_plyr
        } 

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