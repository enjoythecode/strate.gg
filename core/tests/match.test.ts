import { Match } from "../src/match"
import { GameName } from "../src/game"

describe("Match", () => {
    it("is initialized with a game name", () => {
        const match = new Match(GameName.AMAZONS);
    })
    it("getGameName", () => {
        const match = new Match(GameName.AMAZONS);
        expect(match.getGameName()).toBe(GameName.AMAZONS)
    })
})