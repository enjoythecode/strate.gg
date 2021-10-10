import { makeObservable, observable, action } from "mobx"
import { Challenge } from "./Challenge.js"
import Socket from './Socket.js'


class State {
    active_users = 0
    connection_status = "offline"
    challenges = observable.map({})

    constructor(){
        makeObservable(this, {
            challenges: observable,
            update_challenge_information: action,

            active_users: observable,
            set_active_users: action,

            connection_status: observable,
            set_connection_status: action
        })
    }

    set_socket = (sckt) => {this.socket = sckt}
    set_active_users = (new_active_users) => {this.active_users = new_active_users}
    set_connection_status = (new_connection_status) => {this.connection_status = new_connection_status}
    
    update_challenge_information = (data) => {
        let cid = data.cid
        let chs = this.challenges

        if(!chs.has(cid)){chs.set(cid, new Challenge(cid,"amazons"))}
        chs.get(cid).update_challenge_information(data)
    }

    update_challenge_new_move = (data) => {
        let cid = data.cid
        if(this.challenges.has(cid)){
            this.challenges.get(cid).process_new_move(data.move)
        }
    }

}

// we create all of our stores, socket IO class
// and export them from this module to make it available to access
// from every file without using React Contexts
const RootState = new State()
const socket = new Socket()
RootState.set_socket(socket)

export default RootState;
