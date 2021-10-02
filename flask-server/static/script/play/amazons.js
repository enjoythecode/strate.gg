var player_1 = null
var player_2 = null

// CODES?
// empty
// 1 queen white
// 2 queen black
// 3 border
var board = []
var moves = []
var turn = 0
var game_size = null
var game_in_progress = false
var game_is_playing = false

temp_source = null
temp_move = null
temp_shoot = null
temp_step = 0

player_list = []
$(document).ready(function() {
    amazons_status_el = document.getElementById("amazons-play-game-status")
    amazons_players_el = document.getElementById("amazons-play-game-players")
    load_game()
});



function get_game_id(){
    params = new URLSearchParams(window.location.search);
    return params.get('gid');
}

function poll_game_join(gid){
    return new Promise((resolve, reject) => {
        socket.emit('game-join', {"gid": gid}, (data) =>{
            if(data){
                if(data.result && data.result === "success"){
                    console.log(data.info.board)
                    return resolve(data.info);
                }else{
                    return reject(data.error)
                }
            }else{
                return reject("Payload not defined!")
            }
        })
    })
}

function update_status_text(){
    console.log(amazons_status_el, amazons_players_el, game_in_progress)
    if(game_in_progress){
        amazons_status_el.textContent = "Game is in progress."
    }else{
        amazons_status_el.textContent = "Waiting for opponent"
    }
    amazons_players_el.textContent = player_list.toString()
}

function load_game()
{
    if(socket && socket.connected){
        gid = get_game_id()
        poll_game_join(gid).then( info => {

            game_in_progress = info.in_progress
            game_is_playing = info.client_is_player
            player_list = info.players

            board = info.board
            game_size = info.game_size

            update_status_text()

            $("#game").empty()
            $("#game").css("grid-template-columns","50px ".repeat(game_size) + "50px") // one extra cell for the trailing space AND the column number

            for (let row = 0; row < game_size; row++) {
                for (let col = 0; col < game_size; col++) {
                    
                    cell_count = row.toString() + col.toString()
                    if( (col + row) %2 == 0 ){
                        cell_color = "white"
                    }else{
                        cell_color = "black"
                    }
                    $("#game").append('<div class="game-cell cell-' + cell_color + '" id="cell-' + cell_count + '" data-cell="' + cell_count + '"></div>')
                
                    if(board[row][col] != 0){
                        update_cell_image(row.toString() + col.toString(),board[row][col] - 1, 0)
                    }

                }
                $("#game").append('<div class="game-cell center-content">' + (game_size-row).toString() + '</div>')
            }
            for (let c = 0; c < game_size; c++) {
                $("#game").append('<div class="game-cell center-content">' + String.fromCharCode(65 + c) + '</div>')
                
            }

            $(".game-cell").click(function() {
                handle_click($(this).data("cell"));
            });

        }, err => console.log(err))

    }else{
        setTimeout(load_game, 300); // try again in 300 milliseconds
    }
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
    }else {

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

function handle_click(cell){
    if(!game_in_progress || !game_is_playing){
        console.log("game is not played by this client, or game is not in progress.")
        return null;
    }
    cell = cell.toString()
    if (temp_step == 0){
        if(board[Number(cell[0])][Number(cell[1])] == turn + 1){
            temp_source = cell
            board[Number(temp_source.charAt(0))][Number(temp_source.charAt(1))] = 0
            document.getElementById("cell-" + cell).classList.add("selected-indicator-source");
            valid_move_indicator(temp_source,0)
            
            temp_step += 1;
        }else{//not players turn
            console.log(board[Number(cell[0])][Number(cell[1])], turn + 1)
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