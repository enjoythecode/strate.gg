import { GameName } from "./game"

export class Match {
    gameName: GameName

    constructor(gameName: GameName){
        this.gameName = gameName
    }

    getGameName(){
        return this.gameName
    }
}
