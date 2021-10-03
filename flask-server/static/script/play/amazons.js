var player_1 = null
var player_2 = null

var board = []
var moves = []
var turn = 0
var game_size = null
var game_in_progress = false
var game_is_playing = false
var game_player_side = 0 // 1: White, 2: Black, 0: game_is_playing == False

temp_source = null
temp_move = null
temp_shoot = null
temp_step = 0

player_list = []
$(document).ready(function() {
    amazons_status_el = document.getElementById("amazons-play-game-status")
    amazons_players_el = document.getElementById("amazons-play-game-players")
    join_game()
});



function get_game_id(){
    params = new URLSearchParams(window.location.search);
    return params.get('gid');
}

function poll_game_join(gid){
    //https://stackoverflow.com/questions/37876889/react-redux-and-websockets-with-socket-io
    return new Promise((resolve, reject) => {
        socket.emit('game-join', {"gid": gid}, (data) =>{
            if(data){
                if(data.result && data.result === "success"){
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

function process_game_data(info){
    game_in_progress = info.in_progress
    if(info.client_is_player){
        game_is_playing = info.client_is_player
    }
    if(info.client_side){
        game_player_side = info.client_side
    }
    player_list = info.players

    console.log(board)
    board = info.board
    console.log(info.board, board == info.board)
    turn = info.turn
    game_size = info.game_size

    update_status_text()

    $("#board").empty()
    $("#board").css("grid-template-columns","50px ".repeat(game_size) + "50px") // one extra cell for the trailing space AND the column number

    for (let row = 0; row < game_size; row++) {
        for (let col = 0; col < game_size; col++) {
            
            cell_count = row.toString() + col.toString()
            if( (col + row) %2 == 0 ){
                cell_color = "white"
            }else{
                cell_color = "black"
            }
            $("#board").append('<div class="game-cell cell-' + cell_color + '" id="cell-' + cell_count + '" data-cell="' + cell_count + '"></div>')
        
            if(board[row][col] != 0){
                update_cell_image(row.toString() + col.toString(),board[row][col] - 1, 0)
            }

        }
        $("#board").append('<div class="game-cell center-content">' + (game_size-row).toString() + '</div>')
    }
    for (let c = 0; c < game_size; c++) {
        $("#board").append('<div class="game-cell center-content">' + String.fromCharCode(65 + c) + '</div>')
        
    }

    $(".game-cell").click(function() {
        handle_click($(this).data("cell"));
    });
}

function join_game()
{
    if(socket && socket.connected){
        gid = get_game_id()
        poll_game_join(gid).then( info => {
            process_game_data(info)
            socket.on("game-update", info => {
                console.log("Game update received!")
                process_game_data(info)
            })
        }, err => console.log(err))
    }else{
        setTimeout(join_game, 300); // try again in 300 milliseconds
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

    el_clist = document.getElementById("cell-" + cell).classList;

    if(add_or_remove == 0){
        el_clist.add(class_name)
        if(class_name.includes("queen")){
            el_clist.add("cell-queen")
        }
    }else{
        el_clist.remove(class_name)
        if(class_name.includes("queen")){
            el_clist.remove("cell-queen")
        }
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

function valid_move_indicator(cell, removeOrAdd, moveOrShoot){

    if(moveOrShoot == "move"){
        indicatorName = "valid-move-indicator"
    }else{
        indicatorName = "valid-shoot-indicator"
    }

    if(removeOrAdd === "remove"){ // remove indicators
        for (let x = 0; x < game_size; x++) {
            for (let y = 0; y < game_size; y++) {
                cellClasses = document.getElementById("cell-" + x.toString() + y.toString()).classList;
                if(cellClasses.contains(indicatorName)){
                    cellClasses.remove(indicatorName)
                }
            }
        }
    }else{ // add indicators
        c_x = Number(cell[0])
        c_y = Number(cell[1])
        for (let x = 0; x < game_size; x++) {
            for (let y = 0; y < game_size; y++) {
                if(cell_can_reach(cell,x.toString() + y.toString())){
                    
                    document.getElementById("cell-" + x.toString() + y.toString()).classList.add(indicatorName)
                    
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
        valid_move_indicator(temp_source,"remove","move")
    }
    if(temp_move){
        document.getElementById("cell-" + temp_move).classList.remove("selected-indicator-move");
        valid_move_indicator(temp_move,"remove","shoot")
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
        if(board[Number(cell[0])][Number(cell[1])] == turn + 1 && game_player_side == turn + 1){
            temp_source = cell
            board[Number(temp_source.charAt(0))][Number(temp_source.charAt(1))] = 0
            document.getElementById("cell-" + cell).classList.add("selected-indicator-source");
            valid_move_indicator(temp_source,"add","move")
            
            temp_step += 1;
        }else{
            console.log(board[Number(cell[0])][Number(cell[1])], turn + 1)
            reset_move("not players turn",false)
        }
    }else if(temp_step == 1){
        if(cell_can_reach(temp_source,cell)){
            temp_move = cell
            board[Number(temp_move.charAt(0))][Number(temp_move.charAt(1))] = turn + 1
            valid_move_indicator(temp_source,"remove","move")
            valid_move_indicator(temp_move,"add", "shoot")
            document.getElementById("cell-" + cell).classList.add("selected-indicator-move");
            temp_step += 1;
        }else{
            reset_move("invalid movement", false)
        }
    }else if(temp_step == 2){
        temp_shoot = cell
        if(cell_can_reach(temp_move,temp_shoot,temp_source)){
            valid_move_indicator(temp_move,"remove", "shoot")
            board[Number(temp_shoot.charAt(0))][Number(temp_shoot.charAt(1))] = 3
            play(temp_source, temp_move, temp_shoot);
        }else{
            reset_move("invalid shot",false)
        }
    }
}

function play(source, move, shoot){
    console.log(source, move, shoot)
    //https://stackoverflow.com/questions/37876889/react-redux-and-websockets-with-socket-io
    p = new Promise((resolve, reject) => {
        socket.emit('game-move', {"gid": gid, "move": {"from": source, "to": move, "shoot": shoot}}, (data) =>{
            if(data){
                if(data.result && data.result === "success"){
                    return resolve(data);
                }else{
                    return reject(data)
                }
            }else{
                return reject("No response received!")
            }
        })
    })

    p.then( info => {
        // no need to receive or process game data here because it will already be emitted to the room
        moves.push([turn, source, move, shoot])
        temp_step = 0
        console.log("new turn", turn)
    }, err => console.log(err))

}