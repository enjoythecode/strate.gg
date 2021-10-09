import { makeObservable, computed, observable, action } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import RootState  from "./State.js"
import { ChallengeView } from "./Challenge.js"

const Tv = observer(class Tv extends React.Component{

    cid = null

    constructor(){
        super()
        makeObservable(this, {
            cid: observable,
            update_cid: action
        })
    }

    componentDidMount(){
        this.poller = setInterval(()=> this.poll_for_games(), 2500);
    }

    update_cid(cid){
        this.cid = cid
    }

    poll_for_games(){
        console.log(this.cid)
        
        let noChallenge = this.cid === null
        let challengeNotPlaying = !noChallenge && (
            RootState.challenges.has(this.cid) &&
            RootState.challenges.get(this.cid).status == "IN_PROGRESS"
            )
        
        if( noChallenge || challengeNotPlaying){
            console.log("polling", this.cid)
            RootState.socket.poll_tv_games({}, (data) => {
                console.log("poll received: ", data)
                this.update_cid(data.cid)
                RootState.socket.join_challenge(data.cid)
            })
        }
    }

    componentWillUnmount(){
        clearInterval(this.poller)
        this.poller = null;
    }

    render(){
        return (
            <div style={{"border":"solid"}}>
                <h1>Observe! {this.cid} </h1>
                <h2>{RootState.challenges.get(this.cid) ? "found game to watch!" : "no games yet"}</h2>
                <ChallengeView challenge={RootState.challenges.get(this.cid)} />
            </div>
        );
    }
}) 

export default Tv