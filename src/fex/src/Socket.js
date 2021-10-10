import io from 'socket.io-client'
import RootState  from "./State.js"

class Socket {

    constructor() {
        this.io = null
    }

    connect = () => {
        this.io = io("127.0.0.1:8080");
        // Pondering: Can this line ever be slow enough (or light travel fast enough) where the "connect" event happens before it is binded?
        // Answer: very, very, very unlikely. It is both light, and one is traveling (at least) hundreds of miles.
        this.bind_socket_listeners() 
        RootState.set_connection_status("connecting")
    }

    bind_socket_listeners = () => {
        this.io.on("connect", (data) => {
            RootState.set_connection_status("online")
        })

        this.io.on("disconnect", (data) => {
            RootState.set_connection_status("offline")
        })

        this.io.on('connection-info-update', (data) => {
            RootState.set_active_users(data.users)
        });

        this.io.on("game-update-move", (data) => {
            RootState.update_challenge_new_move(data)
        })

        this.io.on("game-update-meta", (data) => {
            if("result" in data && data.result === "success"){
                RootState.update_challenge_information(data.info)
            }
        })
    }

    create_new_game = (payload) => {
        this.io.emit('game-create', payload, (data) =>{
            if(data.result && data.result === "success"){
                RootState.update_challenge_information(data)
                window.location.replace("/play/" + data.game_name + "?cid=" + data.cid)
            }
        })
    }

    join_challenge = (cid) => {
        this.io.emit('game-join', {"cid": cid}, (data) => {
            if("result" in data && data.result === "success"){
                RootState.update_challenge_information(data.info)
            }
        })
    }

    send_move = (payload) => {
        this.io.emit('game-move', payload)
    }

    poll_tv_games(payload, successCallback){
        this.io.emit('tv-poll', payload, (data) => {
            if("result" in data && data.result === "success"){
                successCallback(data);
            }
        })
    }

}

export default Socket