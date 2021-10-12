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
        // TODO
        //if(this.turn === this.challenge.client_turn + 1 && this.challenge.status === "IN_PROGRESS"){
            this.challenge.send_move({"pit": p})
        //} 
    }

    process_new_move(move){
        // TODO: implement
        console.log("TODO: implement processing moves!", move)

        let ptr = move["pit"]
        console.log(this.board)
        let seeds = this.board["pits"][this.turn][ptr]

        this.board["pits"][this.turn][ptr] = 0
        while(seeds){
            ptr += 1
            if(ptr === 6){
                this.board["banks"][this.turn] += 1
            }else if(ptr === 13){
                ptr = 0
            }else{
                let side = (this.turn + Math.floor(ptr / 6)) % 2
                this.board["pits"][side][ptr%6-(ptr > 6 ? 1 : 0)] += 1
            }
            seeds -= 1
        }

        // Capture on landing in an empty pit
        if(ptr < 6 && this.board["pits"][this.turn][ptr] == 1){
            let captured = this.board["pits"][this.turn][ptr]
            
            captured += this.board["pits"][(this.turn + 1) % 2][5-ptr]
            this.board["banks"][this.turn] += captured

            this.board["pits"][this.turn][ptr] = 0
            this.board["pits"][(this.turn + 1) % 2][5-ptr] = 0
        }

        if (! ptr === 6){ // if move didn't end in self-bank, turn moves to the next player
            this.turn = (this.turn + 1) % 2
        }

        this.turn = (this.turn + 1) % 2
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