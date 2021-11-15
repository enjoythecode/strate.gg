import { makeObservable, computed, observable, action } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import './grid.css'

const boardCss = (x) => { return {
        "aspectRatio": "1 / 1",
        "display": "grid",
        "gridTemplateColumns": "repeat("+x+", 1fr)",
        "gridTemplateRows": "repeat("+x+", 1fr)",
        "position": "relative",
        "width": "70vmin",
        "height": "70vmin"
    }
}

const pieceCss = {
    position:"absolute",
    width:"10%",
    height:"10%" 
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
    }
    if(!("size" in config && "variation" in config)){return false;}
    let key = config["size"].toString() + "_" + config["variation"].toString()
    if(! (key in startingBoards)) return false;
    return startingBoards[key]
}

class Amazons {
    constructor(challenge, config){
        makeObservable(this,{
            board: observable,
            selection: observable,
            lastMove: observable,
            turn: observable,
            setTurn: action,
            clickCell: action,
            process_new_move: action,
            resetSelection: action,
            selectionFrom:  computed,
            selectionTo: computed,
            selectionShoot: computed,
            currentSelectionStep: computed,
            boardCssClasses: computed,
            renderedPieces: computed,
        })

        this.setTurn(0)
        this.config = config
        this.challenge = challenge
        this.board = initializeBoard(config)
    }

    turn = null
    board = null
    selection = [null, null, null]; // selected cells; [from, to, shoot]
    lastMove = [null, null, null];

    turn_to_color = [{"name":"White", "rgb":"#FFF"}, {"name":"Black", "rgb":"#000"}];

    setTurn = (val) => {
        console.log("setting", val)
        this.turn = val;
        console.log("set", this.turn)
    }

    resetSelection = () => {
        this.selection = [null, null, null];
    }

    clickCell = (c) => {
        // check if it is the players turn before allowing a click
        // also checks for observers because client_turn == -1 if the client is not a player
        if(this.turn === this.challenge.client_turn && this.challenge.status === "IN_PROGRESS"){
            switch (this.currentSelectionStep) {
                case "from":
                    if(this.board[Number(c[0])][Number(c[1])] === this.turn + 1){
                        this.selection[0] = c
                    }
                    break;
                case "to":
                    if(this.cell_can_reach(this.selectionFrom, c)){
                        this.selection[1] = c
                    }else{
                        this.resetSelection()
                    }
                    break;
                case "shoot":
                    if(this.cell_can_reach(this.selectionTo, c, this.selectionFrom)){
                        this.selection[2] = c
                        this.challenge.send_move(this.formatMoveForSend())
                    }
                    this.resetSelection()
                    break;
                default:
                    break;
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
    
        if(d_x === 0 && d_y === 0) return false;
        if(d_x !== 0 && d_y !== 0 && Math.abs(d_x) !== Math.abs(d_y)) return false // on the diagonal, |x| must == |y|
        
        // normalize d_x, d_y to 1, 0, or -1. 
        let step_x = d_x === 0 ? 0 : d_x / Math.abs(d_x) //the short-hand if prevents division by 0
        let step_y = d_y === 0 ? 0 : d_y / Math.abs(d_y) //the short-hand if prevents division by 0
        
        let steps = Math.max(Math.abs(d_x), Math.abs(d_y)) // how many squares is between from and to?
        
        for (let i = 1; i <=steps; i++) {
            let new_x = from_x + step_x * i
            let new_y =from_y + step_y * i
            if(this.board[new_x][new_y] !== 0){
                if (new_x.toString() + new_y.toString() !== ignore){
                    return false
                }
            }
        }
        return true
    }

    format_move_for_human = (move) => {
        let ind2coord = (index) => {
            console.log(index)
            return String.fromCharCode(65 + Number(index[1])) + String(Number(index[0])+1);
        }
        console.log(move)
        return ind2coord(move.from) + "-" + ind2coord(move.to) + "/" + ind2coord(move.shoot)
    }

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
        this.board[to_x][to_y] = this.turn + 1
        this.board[shoot_x][shoot_y] = 3

        this.setTurn((this.turn + 1) % 2)

        this.lastMove = [move.from, move.to, move.shoot]
    }

    get selectionFrom () {return this.selection[0]}
    get selectionTo () {return this.selection[1]}
    get selectionShoot () {return this.selection[2]}
    get currentSelectionStep () {
        if(this.selectionFrom === null) return "from"
        if(this.selectionTo === null) return "to"
        if(this.selectionShoot === null) return "shoot"
        return null
    }

    get renderedPieces(){
        let pieces = [];

        for(let x = 0; x < this.config.size; x++){
            for(let y = 0; y < this.config.size; y++){

                if(this.board[x][y] !== 0){

                    let img_src = ["/images/wqueen.png", "/images/bqueen.png", "/images/fire.png"][this.board[x][y] - 1];
                    let img_alt = ["White Queen", "Black Queen", "Burnt Off Square"][this.board[x][y] - 1];
                    
                    let positionCss = {
                        left: y * 10 + "%", // TODO: FIX: Make this adaptive to board size!
                        top: x * 10 + "%"
                    }

                    pieces.push(
                        <img src={img_src} alt={img_alt} style={{...positionCss, ...pieceCss}} key={pieces.length}
                            onClick={() => {this.clickCell(x.toString() + y.toString())}}>
                        </img>
                    )
                }
            }
        }

        return pieces;
    }

    get boardCssClasses(){
        let result = []
        for(let x = 0; x < this.config.size; x++){
            let row = []
            for(let y = 0; y < this.config.size; y++){
                let cell = x.toString() + y.toString()
                let classes = [];

                // TODO: separate this because it never changes
                classes.push((y % this.config.size + x) % 2 ? "cellLight" : "cellDark");

                // last move indicator
                if (this.lastMove !== null && this.lastMove.includes(cell))
                    classes.push(...["indicator", "indicatorLastMove"])

                // TODO: Optimize the speed of this by having the movables put on indication classes to cells instead!
                if (this.currentSelectionStep === "to" && this.cell_can_reach(this.selectionFrom, cell)) 
                    classes.push(...["indicator", "indicatorPrimary"])
                if (this.currentSelectionStep === "shoot" && this.cell_can_reach(this.selectionTo, cell, this.selectionFrom)) 
                    classes.push(...["indicator", "indicatorSecondary"])
                if (this.currentSelectionStep === "shoot" && this.selectionTo === cell) 
                    classes.push(...["indicator", "indicatorSecondary"])

                if (classes.includes("indicator")){
                    if (this.currentSelectionStep === "shoot" && 
                    [this.selectionFrom, this.selectionTo].includes(cell)){
                        classes.push("indicatorOuter")
                    }else{
                        classes.push("indicatorInner")
                    }
                }

                row.push(classes.join(" "))
            }
            result.push(row)
        }
        return result
    }
}

const AmazonsView = observer(class _ extends React.Component{

    render() {
        let boardCells = []
        let size = this.props.game_state.board.length

        for(let x = 0; x < size; x++){
            for(let y = 0; y < size; y++){
                boardCells.push(
                    <div
                        className={this.props.game_state.boardCssClasses[x][y]}
                        key={x * size + y}
                        onClick={() => {this.props.game_state.clickCell(x.toString() + y.toString())}}>
                    </div>
                )
            }
        }

        return (
            <div style={boardCss(this.props.game_state.board.length)}>
                {boardCells}
                {this.props.game_state.renderedPieces}
            </div>
        )
    }
})

export {Amazons, AmazonsView}