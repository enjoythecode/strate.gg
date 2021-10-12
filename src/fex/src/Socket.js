import io from 'socket.io-client'
import RootState  from "./State.js"
import { makeObservable, observable, action } from "mobx"

class Socket {

    socket_id = ""
    active_users = 0
    connection_status = "offline"

    constructor() {
        makeObservable(this, {
            socket_id: observable,
            set_socket_id: action,

            active_users: observable,
            set_active_users: action,
            
            connection_status: observable,
            set_connection_status: action,
        })
        this.io = null
    }

    set_socket_id = (sid) => {this.socket_id = sid}
    set_active_users = (new_active_users) => {this.active_users = new_active_users}
    set_connection_status = (new_connection_status) => {this.connection_status = new_connection_status}
    
    connect = () => {
        this.io = io("127.0.0.1:8080");
        // Pondering: Can this line ever be slow enough (or light travel fast enough) where the "connect" event happens before it is binded?
        // Answer: very, very, very unlikely. It is both light, and one is traveling (at least) hundreds of miles.
        this.bind_socket_listeners() 
        this.set_connection_status("connecting")
    }

    bind_socket_listeners = () => {
        this.io.on("connect", (data) => {
            this.set_connection_status("online")
            this.set_socket_id(this.io.id)
        })

        this.io.on("disconnect", (data) => {
            this.set_connection_status("offline")
        })

        this.io.on('connection-info-update', (data) => {
            this.set_active_users(data.users)
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