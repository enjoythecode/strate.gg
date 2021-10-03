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
ready(function() {
    amazons_status_el = $("amazons-play-game-status")
    amazons_players_el = $("amazons-play-game-players")
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

function create_board_square(cell_count, cell_color, text){
    newSq = document.createElement("div")
    newSq.classList.add("game-cell")
    if(text){
        newSq.textContent = text;
        newSq.classList.add("center-content")
    }else{
        newSq.classList.add("cell-" + cell_color)
        newSq.id = "cell-" + cell_count
        newSq.setAttribute("data-cell", cell_count)
    }
    return newSq
}

function process_game_join(info){
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

    board_el = $("board")

    empty(board_el)
    board_el.style.gridTemplateColumns = "50px ".repeat(game_size) + "50px" // one extra cell for the trailing space AND the column number

    for (let row = 0; row < game_size; row++) {
        for (let col = 0; col < game_size; col++) {
            
            cell_count = row.toString() + col.toString()
            if( (col + row) %2 == 0 ){
                cell_color = "white"
            }else{
                cell_color = "black"
            }
            
            newSq = create_board_square(cell_count, cell_color)
            newSq.addEventListener("click",function(event){
                handle_click(event.target.dataset.cell)
            });
            board_el.appendChild(newSq)
        
            if(board[row][col] != 0){
                update_cell_image(row.toString() + col.toString(),board[row][col] - 1, "add")
            }

        }
        board_el.appendChild(create_board_square(null, null, (game_size-row).toString()))
    }
    for (let c = 0; c < game_size; c++) {
        board_el.appendChild(create_board_square(null, null, String.fromCharCode(65 + c)))
    }
}

function process_game_move_update(info){

    move = info.move;

    from = move[0]
    to = move[1]
    shoot = move[2]
    board[Number(from[0])][Number(from[1])] = 0;
    board[Number(to[0])][Number(to[1])] = turn + 1;
    board[Number(shoot[0])][Number(shoot[1])] = 3;

    update_cell_image(move[0],turn,"remove")
    update_cell_image(move[1],turn,"add")
    update_cell_image(move[2],2,"add")

    turn = info.turn;

    moves.push(move)

    new_move_list_item = document.createElement("li")
    new_move_list_item.appendChild(document.createTextNode(move.toString()))
    $("move-list").appendChild(new_move_list_item)
}

function process_game_meta_update(info){
    game_in_progress = info.in_progress
    if(info.client_is_player){
        game_is_playing = info.client_is_player
    }
    if(info.client_side){
        game_player_side = info.client_side
    }
    player_list = info.players

    board = info.board
    turn = info.turn
    game_size = info.game_size

    update_status_text()
}

function join_game()
{
    if(socket && socket.connected){
        gid = get_game_id()
        poll_game_join(gid).then(info => {
            process_game_join(info)
            socket.on("game-update-move", info => {
                console.log("Game move update received!")
                process_game_move_update(info)
            })
            socket.on("game-update-meta", info => {
                console.log("Game meta update received!")
                process_game_meta_update(info)
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

    el_clist = $("cell-" + cell).classList;

    if(add_or_remove === "add"){
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

function cell_can_reach(from, to, ignore){
    from_x = Number(from.toString()[0])
    from_y = Number(from.toString()[1])
    to_x = Number(to.toString()[0])
    to_y = Number(to.toString()[1])
    d_x = to_x - from_x
    d_y = to_y - from_y

    if(d_x == 0 && d_y == 0) return false;
    if(d_x != 0 && d_y != 0 && Math.abs(d_x) != Math.abs(d_y)) return false // on the diagonal, |x| must == |y|
    
    // normalize d_x, d_y to 1, 0, or -1. 
    step_x = d_x == 0 ? 0 : d_x / Math.abs(d_x) //the short-hand if prevents division by 0
    step_y = d_y == 0 ? 0 : d_y / Math.abs(d_y) //the short-hand if prevents division by 0
    
    steps = Math.max(Math.abs(d_x), Math.abs(d_y)) // how many squares is between from and to?
    
    for (let i = 1; i <=steps; i++) {
        new_x = from_x + step_x * i
        new_y =from_y + step_y * i
        if(board[new_x][new_y] != 0){
            if (new_x.toString() + new_y.toString() != ignore){
                return false
            }

        }
    }

    return true
}

function valid_move_indicator(cell, removeOrAdd, moveOrShoot, shootingQueen){

    // TODO optimize: this function loops over the whole board. this is unnecessary, especially for the valid move indicator!
    if(moveOrShoot == "move"){
        indicatorName = "valid-move-indicator"
    }else{
        indicatorName = "valid-shoot-indicator"
    }

    if(removeOrAdd === "remove"){ // remove indicators
        for (let x = 0; x < game_size; x++) {
            for (let y = 0; y < game_size; y++) {
                cellClasses = $("cell-" + x.toString() + y.toString()).classList;
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
                // the shooting queen (the queen which is moving and shooting) can shoot to her origin
                console.log(cell, shootingQueen)
                newCell = x.toString() + y.toString()
                if(cell_can_reach(cell,newCell) || (shootingQueen && newCell == shootingQueen)){
                    $("cell-" + newCell).classList.add(indicatorName)
                }
            }
        }
    }
}

function handle_click(cell){
    if(!game_in_progress || !game_is_playing){
        console.log("game is not played by this client, or game is not in progress.")
        return null;
    }

    cell = cell.toString()
    cell_classes = $("cell-" + cell).classList
    reset = false

    // the visualization commands here are quite hefty and overall this board script would
    // benefit greatly from a declarative class library.
    if (temp_step == 0){
        if(board[Number(cell[0])][Number(cell[1])] == turn + 1 && game_player_side == turn + 1){
            temp_source = cell
            cell_classes.add("selected-indicator-source");
            valid_move_indicator(temp_source,"add","move")
            temp_step += 1;
        }else{
            reset = true
            valid_move_indicator(temp_source,"remove","move")
            cell_classes.remove("selected-indicator-source");
        }
    }else if(temp_step == 1){
        if(cell_can_reach(temp_source,cell)){
            temp_move = cell
            valid_move_indicator(temp_source,"remove","move")
            valid_move_indicator(temp_move,"add", "shoot", temp_source)
            cell_classes.add("selected-indicator-move");
            temp_step += 1;
        }else{
            reset = true
            valid_move_indicator(temp_move,"remove", "shoot")
            valid_move_indicator(temp_source,"remove","move")
            $("cell-" + temp_source).classList.remove("selected-indicator-source")
            cell_classes.remove("selected-indicator-move");
        }
    }else if(temp_step == 2){
        temp_shoot = cell
        if(cell_can_reach(temp_move,temp_shoot,temp_source)){
            play(temp_source, temp_move, temp_shoot);
            valid_move_indicator(temp_move,"remove", "shoot")
            $("cell-" + temp_source).classList.remove("selected-indicator-source")
            $("cell-" + temp_move).classList.remove("selected-indicator-move")
        }else{
            reset = true
            valid_move_indicator(temp_move,"remove", "shoot")
            $("cell-" + temp_source).classList.remove("selected-indicator-source")
            $("cell-" + temp_move).classList.remove("selected-indicator-move")
        }
    }
    if (reset){
        temp_move = null 
        temp_source = null
        temp_shoot = null
        temp_step = 0
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