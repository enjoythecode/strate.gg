import { Challenge } from "Challenge/Challenge";

const NEW_AMAZONS_CHALLENGE_DATA = {
  game_name: "amazons",
  state: {
    board: [
      [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    ],
    config: { size: 10, variation: 0 },
    turn: 0,
    number_of_turns: 0,
  },
  players: ["T6A8IVnZQvivs4GS9iwK/Q=="],
  moves: [],
  status: "WAITING_FOR_PLAYERS",
  cid: "IJFFOUDW",
  player_won: -1,
};

const AMAZONS_CHALLENGE_DATA_AFTER_MOVE = {
  game_name: "amazons",
  state: {
    board: [
      [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 3, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    ],
    config: { size: 10, variation: 0 },
    turn: 1,
    number_of_turns: 1,
  },
  players: ["T6A8IVnZQvivs4GS9iwK/Q==", "zochGd8NSKivkNCoiwzTow=="],
  moves: [{ from: "96", to: "16", shoot: "13" }],
  status: "IN_PROGRESS",
  cid: "IJFFOUDW",
  player_won: -1,
};

describe("Challenge class creation and updating methods", () => {
  it("can be initialized", () => {
    let chall = new Challenge(NEW_AMAZONS_CHALLENGE_DATA);
    expect(chall).toBeDefined();
  });

  it("contains the data passed to it in the constructor", () => {
    let data = NEW_AMAZONS_CHALLENGE_DATA;
    let chall = new Challenge(data);
    expect(chall.cid).toEqual(data.cid);
    expect(chall.players).toEqual(data.players);
    expect(chall.moves).toEqual(data.moves);
    expect(chall.status).toEqual(data.status);
  });

  it("can be updated with new challenge information", () => {
    let data = AMAZONS_CHALLENGE_DATA_AFTER_MOVE;
    let chall = new Challenge(NEW_AMAZONS_CHALLENGE_DATA);
    chall.update_challenge_information(data);
    expect(chall.cid).toEqual(data.cid);
    expect(chall.players).toEqual(data.players);
    expect(chall.moves).toEqual(data.moves);
    expect(chall.status).toEqual(data.status);
  });
});

describe("Joining a Challenge", () => {});

export { NEW_AMAZONS_CHALLENGE_DATA, AMAZONS_CHALLENGE_DATA_AFTER_MOVE };
