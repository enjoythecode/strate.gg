import React from "react"
import { observer } from "mobx-react"
import RootState from "./State.js"

const ConnectionWidget = observer(class ConnectionWidget extends React.Component{
    render(){
        return (
            <div style={{position:'absolute', top:'0', right:'0'}}>
                You're {RootState.socket.connection_status}. 
                <b> {RootState.socket.active_users}</b> online users!
            </div>
        )
    }
})

export default ConnectionWidget