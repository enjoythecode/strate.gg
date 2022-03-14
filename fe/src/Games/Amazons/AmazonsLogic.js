import { makeObservable, observable, action } from "mobx";
import { React } from "react";

const initializeBoard = (config) => {
  let startingBoards = {
    "10_0": [
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
  };
  if (!("size" in config && "variation" in config)) {
    throw Error("Invalid configuration.");
  }
  let key = config["size"].toString() + "_" + config["variation"].toString();
  if (!(key in startingBoards)) return false;
  return startingBoards[key];
};

// TODO (Amazons general) change cell naming convention from "xy" to two integer arguments/parameters x and y!

class AmazonsLogic {
  constructor(challenge, config) {
    makeObservable(this, {
      board: observable,
      turn: observable,
      setTurn: action,
      update_game_information: action,
    });

    this.setTurn(0);
    this.config = config;
    this.challenge = challenge;
    this.board = initializeBoard(config);
  }

  turn = null;
  board = null;

  // TODO move to AmazonsView
  turn_to_color = [
    {
      name: "White",
      badge: (
        <img
          style={{ width: "100%", height: "100%" }}
          src="/images/wqueen.png"
          alt="White Queen Piece"
        />
      ),
    },
    {
      name: "Black",
      badge: (
        <img
          style={{ width: "100%", height: "100%" }}
          src="/images/bqueen.png"
          alt="Black Queen Piece"
        />
      ),
    },
  ];

  setTurn = (val) => {
    this.turn = val;
  };

  cell_can_reach = (from, to, ignore) => {
    let from_x = Number(from.toString()[0]);
    let from_y = Number(from.toString()[1]);
    let to_x = Number(to.toString()[0]);
    let to_y = Number(to.toString()[1]);
    let d_x = to_x - from_x;
    let d_y = to_y - from_y;

    if (d_x === 0 && d_y === 0) return false;
    if (d_x !== 0 && d_y !== 0 && Math.abs(d_x) !== Math.abs(d_y)) return false; // on the diagonal, |x| must == |y|

    // normalize d_x, d_y to 1, 0, or -1.
    let step_x = d_x === 0 ? 0 : d_x / Math.abs(d_x); //the short-hand if prevents division by 0
    let step_y = d_y === 0 ? 0 : d_y / Math.abs(d_y); //the short-hand if prevents division by 0

    let steps = Math.max(Math.abs(d_x), Math.abs(d_y)); // how many squares is between from and to?

    for (let i = 1; i <= steps; i++) {
      let new_x = from_x + step_x * i;
      let new_y = from_y + step_y * i;
      if (this.board[new_x][new_y] !== 0) {
        if (new_x.toString() + new_y.toString() !== ignore) {
          return false;
        }
      }
    }
    return true;
  };

  static format_move_for_human = (move) => {
    let ind2coord = (index) => {
      return (
        String.fromCharCode(65 + Number(index[1])) +
        String(Number(index[0]) + 1)
      );
    };
    return (
      ind2coord(move.from) +
      "-" +
      ind2coord(move.to) +
      "/" +
      ind2coord(move.shoot)
    );
  };

  update_game_information(new_data) {
    this.board = new_data.board;
    this.turn = new_data.turn;
    // XXX: what exactly am I missing here?
  }
}

export { AmazonsLogic };
