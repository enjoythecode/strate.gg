function poll_create_game(game, size, config){
    
    status_el = document.getElementById("amazons-create-game-status");
    status_el.text = "Loading";

    socket.emit('game-create', {"size": size, "config": config}, (data) =>{
        if(data.result && data.result === "success"){
            status_el.text = "Success, redirecting..."
            window.location.href = "/play/" + game + "?gid=" + data.gid;
        }
    })
}