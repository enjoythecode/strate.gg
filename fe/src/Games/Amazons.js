import { makeObservable, observable, action } from "mobx"
import { observer } from "mobx-react"
import { React, useState} from "react"
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

// TODO (Amazons general) change cell naming convention from "xy" to two integer arguments/parameters x and y!

class Amazons {
    constructor(challenge, config){
        makeObservable(this,{
            board: observable,
            lastMove: observable,
            turn: observable,
            setTurn: action,
            process_new_move: action,
        })

        this.setTurn(0)
        this.config = config
        this.challenge = challenge
        this.board = initializeBoard(config)
    }

    turn = null
    board = null
    lastMove = [null, null, null];

    turn_to_color = [
        {"name":"White", "badge":<img style={{width:"100%", height:"100%"}} src="/images/wqueen.png" alt="White Queen Piece"/>},
        {"name":"Black", "badge":<img style={{width:"100%", height:"100%"}} src="/images/bqueen.png" alt="Black Queen Piece"/>}
    ];

    setTurn = (val) => {
        this.turn = val;
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
            return String.fromCharCode(65 + Number(index[1])) + String(Number(index[0])+1);
        }
        return ind2coord(move.from) + "-" + ind2coord(move.to) + "/" + ind2coord(move.shoot)
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

}

const AmazonsView = observer( 
    ({game_state}) => {

        // the cells that are clicked as part of the current move
        const [selection, setSelection] = useState({"from": null, "to": null, "shoot": null})

        let currentSelectionStep = () => {
            if(selection["from"] === null) return "from"
            if(selection["to"] === null) return "to"
            if(selection["shoot"] === null) return "shoot"

            // TODO is it good style to throw an error here?
            return null // should be unreachable
        }

        let clickCell = (c) => {
            // check if it is the players turn before allowing a click
            // checks for observers because client_turn == -1 if the client is not a player
            if(game_state.turn === game_state.challenge.client_turn && game_state.challenge.status === "IN_PROGRESS"){
                switch (currentSelectionStep()) {
                    case "from":
                        if(game_state.board[Number(c[0])][Number(c[1])] === game_state.turn + 1){
                            // when the new value of selection depends on the old value, we use what is called a 
                            // *functional update*. Read more at https://reactjs.org/docs/hooks-reference.html#functional-updates
                            setSelection(selection => {return {...selection, "from": c}} )
                        }
                        break;

                    case "to":
                        if(game_state.cell_can_reach(selection["from"], c)){
                            setSelection(selection => {return {...selection, "to": c}} )
                        }else{
                            setSelection([{"from": null, "to": null, "shoot": null}])
                        }
                        break;

                    case "shoot":
                        if(game_state.cell_can_reach(selection["to"], c, selection["from"])){
                            // we do not set the state within this if-block because we want the selection to be reset right away
                            game_state.challenge.send_move({...selection, "shoot": c})
                        }
                        setSelection([{"from": null, "to": null, "shoot": null}])
                        break;

                    default:
                        break;
                }
            }
        }
        
        let styleClassesForCellAtCoord = (cell) => {
            let classes = [];
            let x = Number(cell[0])
            let y = Number(cell[1])

            // last move indicator
            if (game_state.lastMove !== null && game_state.lastMove.includes(cell))
                classes.push("indicatorLastMove")
            if (currentSelectionStep() === "to" && game_state.cell_can_reach(selection["from"], cell)) 
                classes.push("indicatorPrimary")
            if (currentSelectionStep() === "shoot" && game_state.cell_can_reach(selection["to"], cell, selection["from"])) 
                classes.push("indicatorSecondary")
            if (currentSelectionStep() === "shoot" && selection["to"] === cell) 
                classes.push("indicatorSecondary")

            if (classes.length > 0){ // this checks if this cell got an indicator class
                classes.push(
                    (
                        currentSelectionStep() === "shoot" && 
                        [selection["from"], selection["to"]].includes(cell)
                    ) ? "indicatorOuter": "indicatorInner"
                )
            }

            // TODO: separate this logic because it never changes
            classes.push((y % game_state.config.size + x) % 2 ? "cellLight" : "cellDark");

            return classes.join(" ")
        }

        let pieces = [];

        for(let x = 0; x < game_state.config.size; x++){
            for(let y = 0; y < game_state.config.size; y++){

                if(game_state.board[x][y] !== 0){

                    let img_src = ["/images/wqueen.png", "/images/bqueen.png", "/images/fire.png"][game_state.board[x][y] - 1];
                    let img_alt = ["White Queen", "Black Queen", "Burnt Off Square"][game_state.board[x][y] - 1];
                    
                    let positionCss = {
                        left: y * 10 + "%", // TODO: FIX: Make this adaptive to board size!
                        top: x * 10 + "%"
                    }

                    pieces.push(
                        <img src={img_src} alt={img_alt} style={{...positionCss, ...pieceCss}} key={pieces.length}
                            onClick={() => {clickCell(x.toString() + y.toString())}}>
                        </img>
                    )
                }
            }
        }

        if (game_state){
            let boardCells = []
            let size = game_state.board.length
    
            for(let x = 0; x < size; x++){
                for(let y = 0; y < size; y++){
                    boardCells.push(
                        <div
                            className={styleClassesForCellAtCoord(x.toString() + y.toString())}
                            key={x * size + y}
                            onClick={() => {clickCell(x.toString() + y.toString())}}>
                        </div>
                    )
                }
            }
    
            return (
                <div style={boardCss(game_state.board.length)}>
                    {boardCells}
                    {pieces}
                </div>
            )
        }else{
            <p>Game is loading...</p>
        }
    }
)

export {Amazons, AmazonsView}