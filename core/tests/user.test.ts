import { User } from "../src/user"

describe("User", () => {
    it("can be initialized without arguments", () => {
        const user = new User();
    })
    it("can be initialized with a name", () => {
        const sinan = new User("sinan");
    })
})