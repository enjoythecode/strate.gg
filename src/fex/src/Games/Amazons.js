import { makeObservable, computed, observable, action } from "mobx"
import { observer } from "mobx-react"
import React from "react"

const makeCellCss = (x) => {
    const cell = {
        "float": "left",
        "display": "inline-block",
        "width": (1/x * 100).toString() + "%",
        "height": (1/x * 100).toString() + "%"
    }
    return cell
}

const boardCss = {
    "aspectRatio": "1 / 1",
    "height": "100%"
}

const blackCell = {
    "backgroundColor": "#946F51"
}

const whiteCell = {
    "backgroundColor": "#F0D9B5"
}

const initializeBoard = (config) => {
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
    if(!("size" in config && "variation" in config)){return false;}
    let key = config["size"].toString() + "_" + config["variation"].toString()
    if(! (key in startingBoards)) return false;
    return startingBoards[key]
}

const getCellImage = (id) => {
    switch (id) {
        case 0:
            return null
        case 1:
            return "White"
        case 2:
            return "Black"
        case 3:
            return "Burnt off"
        default:
            return "?"
    }
} 

class Amazons {

    constructor(challenge, config){
        makeObservable(this,{
            board: observable,
            selection: observable,
            clickCell: action,
            process_new_move: action,
            resetSelection: action,
            selectionFrom:  computed,
            selectionTo: computed,
            selectionShoot: computed
        })
        this.turn = 1
        this.config = config
        this.challenge = challenge
        this.board = initializeBoard(config)
    }

    board = null
    selection = [null, null, null]; // selected cells; [from, to, shoot]

    resetSelection = () => {
        this.selection = [null, null, null];
    }

    clickCell = (c) => {
        if(this.selectionFrom === null){ // from click
            if(this.board[Number(c[0])][Number(c[1])] == this.turn){
                this.selection[0] = c
            }
        }else if(this.selectionTo === null){ // to click
            if(this.cell_can_reach(this.selectionFrom, c)){
                this.selection[1] = c
            }else{
                this.resetSelection()
            }
        }else{ // shoot click
            if(this.cell_can_reach(this.selectionTo, c, this.selectionFrom)){
                this.selection[2] = c
                this.challenge.send_move(this.formatMoveForSend())
                this.selection = [null, null, null]
            }else{
                this.resetSelection()
            }
        }
    }

    cell_can_reach = (from, to, ignore) => {
        let from_x = Number(from.toString()[0])
        let from_y = Number(from.toString()[1])
        let to_x = Number(to.toString()[0])
        let to_y = Number(to.toString()[1])
        let d_x = to_x - from_x
        let d_y = to_y - from_y
    
        if(d_x == 0 && d_y == 0) return false;
        if(d_x != 0 && d_y != 0 && Math.abs(d_x) != Math.abs(d_y)) return false // on the diagonal, |x| must == |y|
        
        // normalize d_x, d_y to 1, 0, or -1. 
        let step_x = d_x == 0 ? 0 : d_x / Math.abs(d_x) //the short-hand if prevents division by 0
        let step_y = d_y == 0 ? 0 : d_y / Math.abs(d_y) //the short-hand if prevents division by 0
        
        let steps = Math.max(Math.abs(d_x), Math.abs(d_y)) // how many squares is between from and to?
        
        for (let i = 1; i <=steps; i++) {
            let new_x = from_x + step_x * i
            let new_y =from_y + step_y * i
            if(this.board[new_x][new_y] != 0){
                if (new_x.toString() + new_y.toString() != ignore){
                    return false
                }
    
            }
        }
    
        return true
    }

    get selectionFrom () {return this.selection[0]}
    get selectionTo () {return this.selection[1]}
    get selectionShoot () {return this.selection[2]}

    formatMoveForSend(){
        return {"from": this.selectionFrom,
                "to": this.selectionTo,
                "shoot": this.selectionShoot
            }
    }

    process_new_move(move){
        let from_x = move.from[0]
        let from_y = move.from[1]
        let to_x = move.to[0]
        let to_y = move.to[1]
        let shoot_x = move.shoot[0]
        let shoot_y = move.shoot[1]

        this.board[from_x][from_y] = 0
        this.board[to_x][to_y] = this.turn
        this.board[shoot_x][shoot_y] = 3

        this.turn = 3 - this.turn
    }

}

const AmazonsView = observer(class _ extends React.Component{
    render() {
        if(this.props.challenge != null){
            let boardCells = []
            let counter = 0
            let rowCounter = 0;
            let cellCss = makeCellCss(this.props.challenge.game_state.board.length)
            
            for(let row of this.props.challenge.game_state.board){
                for(let cell of row){
                    
                    let colorCss = (counter + rowCounter) % 2 === 0 ? blackCell : whiteCell;
                    let cellStringId = rowCounter.toString() + (counter % this.props.challenge.game_state.board.length).toString();
                    boardCells.push(
                        <div   
                            style={{...cellCss, ...colorCss}}
                            key={counter}
                            onClick={this.props.challenge.game_state.clickCell.bind(null, cellStringId)}>
                                {getCellImage(cell)}
                        </div>)
                    counter += 1;

                }
                rowCounter++
            }

            return (
                <div>
                    <h4>
                        F:{this.props.challenge.game_state.selectionFrom} 
                        T:{this.props.challenge.game_state.selectionTo} 
                        S:{this.props.challenge.game_state.selectionShoot} 
                    </h4>
                    <div style={{"height": "300px"}}>
                        <div style={boardCss}>
                            {boardCells}
                        </div>
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

export {Amazons, AmazonsView}