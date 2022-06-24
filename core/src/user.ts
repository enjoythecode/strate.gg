export class User {
    displayName: string
    isRegistered: boolean

    constructor(displayName : string = "", isRegistered : boolean = false){
        this.displayName = displayName
        this.isRegistered = isRegistered
    }

    getDisplayName() : string {
        return this.displayName
    }

    getIsRegistered() : boolean {
        return this.isRegistered
    }
}