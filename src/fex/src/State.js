import { makeObservable, observable, computed, action } from "mobx"

class State {
    active_users = 0
    connection_status = "offline"

    constructor(){
        makeObservable(this, {
            active_users: observable,
            set_active_users: action,

            connection_status: observable,
            set_connection_status: action
        })
    }

    set_socket = (sckt) => {this.socket = sckt}
    set_active_users = (new_active_users) => {this.active_users = new_active_users}
    set_connection_status = (new_connection_status) => {this.connection_status = new_connection_status}
}

export default State;
