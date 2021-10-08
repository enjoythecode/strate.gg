import { observer } from "mobx-react"
import React from "react"
import {Challenge, ChallengeView} from "./Challenge.js"

function get_game_id(){
    let params = new URLSearchParams(window.location.search);
    return params.get('cid');
}

const PlayPage = observer(class PlayPage extends React.Component{

    componentWillMount(){
        this.cid = get_game_id()
        this.props.state.socket.get_challenge_information(this.cid)
    }

    render(){
        let ks = []
        for(let k of this.props.state.challenges.keys()){
            console.log("KEY: ", k)
            ks.push(<li key={k}>{k}</li>)
        }
        return (
            <div>
                <h1>Play! {this.cid} </h1>
                <ul>{ks}</ul>
                <h1>{this.props.state.challenges.size}</h1>
                <h2>{this.props.state.challenges.get(this.cid) ? "yes" : "no"}</h2>
                <ChallengeView challenge={this.props.state.challenges.get(this.cid)} />
            </div>
        );
    }
}) 

export default PlayPage