import { makeObservable, observable, computed, action, flow } from "mobx"
import { observer } from "mobx-react"
import React from "react"

let startingBoards = {
    "10_0": [[0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 0]],
    "6_0": [
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0]
    ],
    "4_0": [
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 2, 0]
    ]

}

let initializeBoard = (config) => {
    if(!("size" in config && "variation" in config)){console.log("-1-", config); return false;}
    let key = config["size"].toString() + "_" + config["variation"].toString()
    if(! key in startingBoards) return false;
    return startingBoards[key]
}

class Amazons {

    constructor(config){
        this.config = config
        this.sss = "ssdsf"
        this.board = initializeBoard(config)
        if(this.board === false){
            console.log("invalid board config!")
        }   
    }
}

const AmazonsView = observer(class _ extends React.Component{
    render() {
        if(this.props.challenge != null){
            let boardCells = []
            let counter = 0
            for(let row of this.props.challenge.game_state.board){
                for(let cell of row){
                    boardCells.push(<p key={counter}>{counter}</p>)
                    counter++
                }
            }
            return (
                <div>
                    <h3>inheritance! {this.props.challenge.game_state.sss} {this.props.challenge.game_state.board === false}</h3>
                    <div>
                        {boardCells}
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <p>"Loading Challenge"</p>
                </div>
            )
        }
    }
})

export {Amazons, AmazonsView}