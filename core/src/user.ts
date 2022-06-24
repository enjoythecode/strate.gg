export class User {
    displayName: string
    isRegistered: boolean

    constructor(displayName : string = ""){
        this.displayName = displayName
    }

    getDisplayName() : string {
        return this.displayName
    }
}