import { makeObservable, observable, computed, action } from "mobx"
import { Challenge } from "./Challenge.js"
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
        console.log("cid", cid)
        if(this.challenges.has(cid)){
            console.log("UPDATING NOT IMPLEMENTED YET!")
        }else{
            console.log("adding!", cid)
            this.challenges.set(cid, new Challenge("amazons"))
            console.log(this.challenges.get(cid))
        }
    }

}

export default State;
