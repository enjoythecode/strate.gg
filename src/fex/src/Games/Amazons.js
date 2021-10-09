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
    if(!("size" in config && "variation" in config)){console.log("-1-", config); return false;}
    let key = config["size"].toString() + "_" + config["variation"].toString()
    if(! key in startingBoards) return false;
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
    }
}

class Amazons {

    constructor(config){
        makeObservable(this,{
            board: observable,
            selection: observable,
            clickCell: action,
            selectionFrom:  computed,
            selectionTo: computed,
            selectionShoot: computed
        })

        this.config = config
        this.board = initializeBoard(config)
        if(this.board === false){
            console.log("invalid board config!")
        }
    }

    board = null
    selection = [null, null, null]; // selected cells; [from, to, shoot]

    clickCell = (c) => {
        console.log("notvalud")
        if(this.isValidClick(c)){
            console.log('valid')
            if(this.selectionFrom === null){
                this.selection[0] = c
            }else if(this.selectionTo === null){
                this.selection[1] = c
            }else{
                this.selection[2] = c
                this.sendMove(this.selection)
                this.selection = [null, null, null]
            }
        }
    }

    get selectionFrom () {return this.selection[0]}
    get selectionTo () {return this.selection[1]}
    get selectionShoot () {return this.selection[2]}

    isValidClick(c){
        let source = this.selectionTo === null ? this.selectionFrom : this.selectionTo
        return true
    }

    sendMove(sel) {
        console.log("implement sending moves!")
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
                    let colorCss = (counter + rowCounter) % 2 == 0 ? blackCell : whiteCell;
                    boardCells.push(<div   
                                        style={{...cellCss, ...colorCss}}
                                        key={counter}
                                        onClick={this.props.challenge.game_state.clickCell.bind(null,counter)}>
                                            {getCellImage(cell)}
                                    </div>)
                    counter += 1;
                }
                rowCounter++
            }
            return (
                <div style={{"height": "300px"}}>
                    <h3>inheritance!{this.props.challenge.game_state.board === false}</h3>
                    <h4>
                        from {this.props.challenge.game_state.selectionFrom}
                        to {this.props.challenge.game_state.selectionTo}
                        shoot {this.props.challenge.game_state.selectionShoot}
                    </h4>
                    <div style={boardCss}>
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