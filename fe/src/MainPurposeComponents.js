import React from "react"
import { observer } from "mobx-react"
import RootState from "./State.js"

// websites gotta have some identity!
const marqueeArr = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Warning: Do not use <marquee> elements as they can create visual accessibility issues and are deprecated.",
    "Comics I enjoy: xkcd"
]

// Modified very slightly from https://stackoverflow.com/a/12646864
const shuffleArray = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const ConnectionWidget = observer(class ConnectionWidget extends React.Component{
    render(){
        return (
            <div style={{position:'absolute', top:'4px', right:'8px'}}>
                You're {RootState.socket.connection_status}. 
                <b> {RootState.socket.active_users}</b> online users!
            </div>
        )
    }
})

class Header extends React.Component{
    render(){
        return (
            <header>
                <h1 style={{paddingLeft:"20%", fontFamily: "'Courier New', monospace", margin: "0"}}>strate.gg</h1> 
                <ConnectionWidget/>
            </header>
        )
    }
}


class Footer extends React.Component{
    render(){

        let marqueeArrShuffled = shuffleArray(marqueeArr)
        let marqueeTags = [];
        for (let i = 0; i<marqueeArr.length;i++) {
            marqueeTags.push(<span style={{paddingRight:"10em"}} key={i}>{marqueeArrShuffled[i]}</span>)
        }

        return (
            <footer>
                <p style={{paddingLeft:"20%", paddingRight:"20%"}}>
                    <span>
                    A project by <a href="enjoythecode.com">Sinan</a> dedicated to the play and exploration of abstract strategy board games.
                        <span style={{float:"right"}}>
                            Take a look at the <a href="https://github.com/enjoythecode/strate.gg">source code.</a>
                        </span>
                    </span>
                    <marquee truespeed="True" scrolldelay="10" scrollamount="1">
                        {marqueeTags}
                    </marquee>
                </p>
            </footer>
        )
    }
}

export {Header, Footer};