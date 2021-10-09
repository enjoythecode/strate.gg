import { observer } from "mobx-react"
import React from "react"
import { ChallengeView } from "./Challenge.js"

function get_game_id(){
    let params = new URLSearchParams(window.location.search);
    return params.get('cid');
}

const PlayPage = observer(class PlayPage extends React.Component{

    componentWillMount(){
        this.cid = get_game_id()
        this.props.state.socket.join_challenge(this.cid)
    }

    render(){
        return (
            <div>
                <h1>Play! {this.cid} </h1>
                <h2>{this.props.state.challenges.get(this.cid) ? "yes" : "no"}</h2>
                <ChallengeView challenge={this.props.state.challenges.get(this.cid)} />
            </div>
        );
    }
}) 

export default PlayPage