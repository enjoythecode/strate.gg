import { Match } from "../src/match"
import { AMAZONS } from "../src/game"

describe("Match", () => {
    describe("initalization", () => {
        it("is initialized with a game name", () => {
            const match = new Match(AMAZONS);
        })
    })
})