import { User } from "../src/user"

const SINAN = "sinan"

describe("User", () => {
    it("can be initialized without arguments", () => {
        const user = new User();
    })
    it("can be initialized with a name", () => {
        const sinan = new User(SINAN);
    })
    it("gives access to the name it was given", () => {
        const sinan = new User(SINAN);
        expect(sinan.getDisplayName()).toBe(SINAN)
    })
    it("can be initialized with whether the user is registered", () => {
        const sinan = new User(SINAN, true);
    })
})