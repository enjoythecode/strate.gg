// empty
// 1 queen white
// 2 queen black
// 3 border

var player_1 = null
var player_2 = null

var board = [] // used to store actual game
var starting_positions = {
    "10_0": [
        [0,"03"],[0,"06"],[0,"30"],[0,"29"],
        [1,"93"],[1,"96"],[1,"60"],[1,"69"]
    ],
    "6_0": [
        [0,"02"],[0,"53"],
        [1,"30"],[1,"25"]
    ],
    "4_0": [
        [0,"11"],
        [1,"22"]
    ]
}
var moves = []
var turn = 0
var game_size = null
temp_source = null
temp_move = null
temp_shoot = null
temp_step = 0

show_move_indicators = true

function bot_find_queen(x = 0, y = -1){
    selected_from = null
    while(selected_from === null){
        
        y++
        if(y == game_size){
            y = 0
            x+=1
        }
        if(board[x][y] === turn + 1){
            selected_from = x.toString() + y.toString()
        }
    }
    return [selected_from,x,y]
}

function bot_play(){
    selected_from = null
    selected_shot = null
    selected_to = null

    

    temp_x = 0
    temp_y = -1
    

    
    while(selected_to === null){

        found_queen = bot_find_queen(temp_x,temp_y)
        selected_from = found_queen[0]
        temp_x = found_queen[1]
        temp_y = found_queen[2]

        for (let x = 0; x < game_size && selected_to === null; x++) {
            for (let y = 0; y < game_size && selected_to === null; y++) {
                if(cell_can_reach(selected_from,x.toString() + y.toString())){
                    
                    selected_to = x.toString() + y.toString()
                    
                }
            }
        }


    }
    handle_click(selected_from)
    
    handle_click(selected_to)
    for (let x = 0; x < game_size && selected_shot === null; x++) {
        for (let y = 0; y < game_size && selected_shot === null; y++) {
            if(cell_can_reach(selected_to,x.toString() + y.toString())){
                
                selected_shot = x.toString() + y.toString()
                
            }
        }
    }  
    
    handle_click(selected_shot)

}

function log_array(a){
    for (let index = 0; index < game_size; index++) {
        console.log(a[index])
    }
}

function toggle_move_indicators(){
    show_move_indicators = !show_move_indicators
}

function coord2index(coord){
    x = coord[0]
    if (x=="A") x=0
    if (x=="B") x=1
    if (x=="C") x=2
    if (x=="D") x=3
    if (x=="E") x=4
    if (x=="F") x=6
    y = Number(coord[1])-1
    return [x,y]
}

// @cell index in the form XY e.g. 02 as a string
function update_cell_image(cell, type, add_or_remove)
{
    if(type == 0){
        class_name = "cell-queen-white"
    }else if (type == 1){
        class_name = "cell-queen-black"
    }else{
        class_name = "cell-fire"
    }

    if(add_or_remove == 0){
        document.getElementById("cell-" + cell).classList.add(class_name)
    }else{
        document.getElementById("cell-" + cell).classList.remove(class_name)
    }
}

function index2coord(index){
    x = index[1]
    if (x=="0") x="A"
    if (x=="1") x="B"
    if (x=="2") x="C"
    if (x=="3") x="D"
    if (x=="4") x="E"
    if (x=="5") x="F"
    y = (Number(index[0])+1).toString()
    return x + y
}

function start_game(size, config){
    game_size = size
    
    player_1 = $("#player-select-1").val()
    player_2 = $("#player-select-2").val()

    // allocate board in memory
    board = []
    for (let i = 0; i < size; i++) {
        temp = Array(size).fill(0)
        board.push(temp)
    }


    // draw cells for board
    $("#game").empty()
    $("#game").css("grid-template-columns","50px ".repeat(size) + "50px") // one extra cell for the trailing space AND the column number

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            
            cell_count = row.toString() + col.toString()
            if( (col + row) %2 == 0 ){
                cell_color = "white"
            }else{
                cell_color = "black"
            }

            $("#game").append('<div class="game-cell cell-' + cell_color + '" id="cell-' + cell_count + '" data-cell="' + cell_count + '"></div>')
        }
        $("#game").append('<div class="game-cell center-content">' + row.toString() + '</div>')
    }
    for (let c = 0; c < size; c++) {
        $("#game").append('<div class="game-cell center-content">' + c.toString() + '</div>')
        
    }

    $(".game-cell").click(function() {
        handle_click($(this).data("cell"));
    });

    //upload game position
    starting_positions[size.toString() + "_" + config.toString()].forEach(element => {
        board[Number(element[1][0])][Number(element[1][1])] = element[0]+1;update_cell_image(element[1],element[0],0)
    });
   
    $("#controls-out-of-game").hide()
    $("#controls-in-game").show()

    if (player_1 === "bot"){
        bot_play()
    }

}

function cell_can_reach(from, to){
    from_x = Number(from.toString()[0])
    from_y = Number(from.toString()[1])
    to_x = Number(to.toString()[0])
    to_y = Number(to.toString()[1])
    d_x = to_x - from_x
    d_y = to_y - from_y
    if(d_x == 0 && d_y == 0) return false;
    flag = true;
    if(d_x == 0){
        for (let i = 1; i <= Math.abs(d_y); i++) {
            if(board[from_x][from_y + i*(d_y/Math.abs(d_y))] != 0){
                flag = false;
            }
        }
    }
    if(d_y == 0){
        for (let i = 1; i <= Math.abs(d_x); i++) {
            if(board[from_x + i*(d_x/Math.abs(d_x))][from_y] != 0){
                flag = false;
            }
        }
    }
    if(d_x != 0 && d_y != 0){
        if(Math.abs(d_x)==Math.abs(d_y)){
            //check diagonal
            for (let i = 1; i <= Math.abs(d_x); i++) {
                if(board[from_x + i*(d_x/Math.abs(d_x))][from_y + i*(d_y/Math.abs(d_y))] != 0){
                    flag = false;
                }
            }
        }else{//not a queen movement
            flag = false
        }
    }

    return flag
}

function valid_move_indicator(cell, mode){
    if(mode == 1){
        for (let x = 0; x < game_size; x++) {
            for (let y = 0; y < game_size; y++) {
                if(document.getElementById("cell-" + x.toString() + y.toString()).classList.contains("valid-move-indicator")){
                    document.getElementById("cell-" + x.toString() + y.toString()).classList.remove("valid-move-indicator")
                }
            }
        }
    }else if(show_move_indicators){

        c_x = Number(cell[0])
        c_y = Number(cell[1])
        for (let x = 0; x < game_size; x++) {
            for (let y = 0; y < game_size; y++) {
                if(cell_can_reach(cell,x.toString() + y.toString())){
                    
                    document.getElementById("cell-" + x.toString() + y.toString()).classList.add("valid-move-indicator")
                    
                }
            }
        }
    }
}

function reset_move(msg, cont){
    console.log(msg)
    
    if(!cont){
        if(temp_source){
            board[Number(temp_source.charAt(0))][Number(temp_source.charAt(1))] = turn + 1
        }
        if(temp_move){
            board[Number(temp_move.charAt(0))][Number(temp_move.charAt(1))] = 0
        }
    }

    if(temp_source){
        document.getElementById("cell-" + temp_source).classList.remove("selected-indicator-source");
        valid_move_indicator(temp_source,1)
    }
    if(temp_move){
        document.getElementById("cell-" + temp_move).classList.remove("selected-indicator-move");
        valid_move_indicator(temp_move,1,temp_source)
    }
    temp_move = null 
    temp_source = null
    temp_shoot = null
    temp_step = 0
}

function undo_last_move(){
    reset_move("undoing last move") // reset current move progress
    last_move = moves.pop()
    
    // delete from <ul> moves
    $("#move-list").last().remove()

    // change board
    last_move_turn = last_move[0]
    last_move_from = last_move[1]
    last_move_to = last_move[2]
    last_move_shot = last_move[3]

    board[Number(last_move_from.charAt(0))][Number(last_move_from.charAt(1))] = last_move_turn + 1
    board[Number(last_move_to.charAt(0))][Number(last_move_to.charAt(1))] = 0
    board[Number(last_move_shot.charAt(0))][Number(last_move_shot.charAt(1))] = 0

    if (last_move_turn == 0){
        moving_element = "cell-queen-white";
    }else{
        moving_element = "cell-queen-black"
    }
    update_cell_image(last_move_from,last_move_turn,0)
    update_cell_image(last_move_to,last_move_turn,1)
    update_cell_image(last_move_shot,2,2)
    
    if (last_move_turn==0){turn = 0}else{turn = 1}
}

function handle_click(cell){
    cell = cell.toString()
    if (temp_step == 0){
        if(board[Number(cell[0])][Number(cell[1])] == turn + 1){
            temp_source = cell
            board[Number(temp_source.charAt(0))][Number(temp_source.charAt(1))] = 0
            document.getElementById("cell-" + cell).classList.add("selected-indicator-source");
            valid_move_indicator(temp_source,0)
            
            temp_step += 1;
        }else{//not players turn
            reset_move("not players turn",false)
        }
    }else if(temp_step == 1){
        if(cell_can_reach(temp_source,cell)){
            temp_move = cell
            board[Number(temp_move.charAt(0))][Number(temp_move.charAt(1))] = turn + 1
            valid_move_indicator(temp_source,1)
            valid_move_indicator(temp_move,0,temp_source)
            document.getElementById("cell-" + cell).classList.add("selected-indicator-move");
            temp_step += 1;
        }else{
            reset_move("invalid movement", false)
        }
    }else if(temp_step == 2){
        temp_shoot = cell
        if(cell_can_reach(temp_move,temp_shoot,temp_source)){
            valid_move_indicator(temp_move,1)
            board[Number(temp_shoot.charAt(0))][Number(temp_shoot.charAt(1))] = 3
            play(temp_source, temp_move, temp_shoot);
        }else{
            reset_move("invalid shot",false)
        }
    }
}

function play(source, move, shoot){
    
    if (turn == 0){
        moving_element = "cell-queen-white";
    }else{
        moving_element = "cell-queen-black"
    }

    update_cell_image(source,turn,1)
    update_cell_image(move,turn,0)
    update_cell_image(shoot,2,0)
   
    moves.push([turn, source, move, shoot])

    if (turn==0){turn = 1}else{turn = 0}
    
    $("#move-list").append("<li>" + index2coord(source) + " > " + index2coord(move) + " x " + index2coord(shoot) + "</li>")

    
    reset_move("played succesfully", true);
    
    if ((turn == 0 && player_1 === "bot") || (turn == 1 && player_2 === "bot")){
        bot_play()
    }
}