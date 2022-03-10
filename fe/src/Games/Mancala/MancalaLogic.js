import { makeObservable, observable, action } from "mobx";

const initializeBoard = () => {
  return [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];

  /* INDICES MAPPING TO BOARD
   *  P2:  13, 12, 11, 10, 9, 8, 7
   *  P1:       0,  1,  2, 3, 4, 5, 6,
   */
};

const BANKS = [6, 13]; // Banks[i] == Index of bank of player i

class MancalaLogic {
  constructor(challenge, config) {
    makeObservable(this, {
      board: observable,
      turn: observable,
      clickPit: action,
      process_new_move: action,
    });

    this.setTurn(0);
    this.config = config;
    this.challenge = challenge;
    this.board = initializeBoard(config);
  }

  turn = null;
  board = null;

  turn_to_color = [
    {
      name: "Down",
      badge: (
        <img
          style={{ width: "100%", height: "100%" }}
          src="/images/wstone.png"
          alt="White Mancala Stone Badge"
        />
      ),
    },
    {
      name: "Up",
      badge: (
        <img
          style={{ width: "100%", height: "100%" }}
          src="/images/bstone.png"
          alt="Black Mancala Stone Badge"
        />
      ),
    },
  ];

  format_move_for_human = (move) => {
    return "Pit " + String(move.pit);
  };

  setTurn = (val) => {
    this.turn = val;
  };

  clickPit = (p, side) => {
    // check if it is the players turn before allowing a click
    // also checks for observers because client_turn == -1 if the client is not a player
    // TODO
    //if(this.turn === this.challenge.client_turn + 1 && this.challenge.status === "IN_PROGRESS"){
    if ((side === "down") === (this.challenge.client_turn === 0)) {
      this.challenge.send_move({ pit: p });
    }
    //}
  };

  process_new_move(move) {
    let ptr = move["pit"] + this.turn * 7;

    let seeds = this.board[ptr];
    let next_plyr = (this.turn + 1) % 2;

    this.board[ptr] = 0;
    while (seeds > 0) {
      ptr += 1;
      ptr = ptr % 14; // wrap around the board!

      if (ptr === BANKS[next_plyr]) {
        // rival bank
        continue;
      } else {
        this.board[ptr] += 1;
        seeds -= 1;
      }
    }

    // check for capture
    // (ruleset: capture happens when landing on empty pit on friendly side)
    if (
      0 <= ptr - 7 * this.turn &&
      ptr - 7 * this.turn <= 5 &&
      this.board[ptr] === 1
    ) {
      let capture = 0;
      for (let i of [ptr, 12 - ptr]) {
        capture += this.board[i];
        this.board[i] = 0;
      }
      this.board[BANKS[this.turn]] += capture;
    }

    // advance the round to the next player if landed outside self-bank.
    if (ptr !== BANKS[this.turn]) {
      this.setTurn(next_plyr);
    }
  }
}

export { MancalaLogic };
