import React from "react"
import ConnectionWidget from "./ConnectionWidget.js"

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

export default Header;