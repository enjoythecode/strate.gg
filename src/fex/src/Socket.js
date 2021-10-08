import io from 'socket.io-client'
import { useContext } from 'react'

class Socket {

    constructor( state ) {
        this.io = null
        this.state = state
    }

    connect = () => {
        console.log(this.state)
        this.io = io("127.0.0.1:8080");
        // Pondering: Can this line ever be slow enough (or light travel fast enough) where the "connect" event happens before it is binded?
        // Answer: very, very, very unlikely. It is both light, and one is traveling (at least) hundreds of miles.
        this.bind_socket_listeners() 
        this.state.set_connection_status("connecting")
    }

    bind_socket_listeners = () => {
        this.io.on("connect", (payload) => {
            this.state.set_connection_status("online")
        })

        this.io.on("disconnect", (payload) => {
            this.state.set_connection_status("offline")
        })

        this.io.on('connection-info-update', (payload) => {
            this.state.set_active_users(payload.users)
        });
    }

    create_new_game = (payload) => {
        this.io.emit('game-create', payload, (data) =>{
            if(data.result && data.result === "success"){
                this.state.update_challenge_information(data)
                window.location.replace("/play/" + data.game_name + "?cid=" + data.cid)
            }
        })
    }

    get_challenge_information = (cid) => {
        this.io.emit('game-join', {"cid": cid}, (data) =>{
            if(data.result && data.result === "success"){
                this.state.update_challenge_information(data.info)
            }
        })
    }

}

export default Socket