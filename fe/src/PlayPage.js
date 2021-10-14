import { observer } from "mobx-react"
import React from "react"
import RootState from "./State.js"
import { ChallengeView } from "./Challenge.js"

function get_game_id(){
    let params = new URLSearchParams(window.location.search);
    return params.get('cid');
}

const PlayPage = observer(class PlayPage extends React.Component{

    constructor() {
        super()
        this.cid = get_game_id()
        RootState.socket.join_challenge(this.cid)
    }

    render(){
        return (
            <div>
                <h3>Play! {RootState.challenges.has(this.cid) ? RootState.challenges.has(this.cid).game_name : "..."} </h3>
                <ChallengeView challenge={RootState.challenges.get(this.cid)} />
            </div>
        );
    }
}) 

export default PlayPage