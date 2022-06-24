import { Match } from "../src/match"
import { AMAZONS } from "../src/game"

describe("Match", () => {
    it("is initialized with a game name", () => {
        const match = new Match(AMAZONS);
    })
    it("getGameName", () => {
        const match = new Match(AMAZONS);
        expect(match.getGameName()).toBe(AMAZONS)
    })
})