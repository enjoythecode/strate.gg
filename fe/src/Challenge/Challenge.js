import { makeObservable, observable, action, computed } from "mobx";
import { AmazonsLogic } from "Games/Amazons/AmazonsLogic";
import { AmazonsView } from "Games/Amazons/AmazonsView";

const game_name_to_state_class = {
  amazons: AmazonsLogic,
};

const game_name_to_view_component = {
  amazons: AmazonsView,
};

/*
A challenge is represented as a Dictionary with the following structure:
{
    "game_name": String. Representing the type of game this challenge is playing
        ex: "amazons" or "mancala",
    "state": An Object that the individual game has serialized according to its
        own representation.
    "players": List of String. The uids of the players, where players[0] is the
        first player, players[1] is the second, etc.
    "moves": List of String. A list of moves in the game in chronological order.
        The encode/decoding to string is handled by the individual game code.
    "status": String (as defined in ChallengeStatus). Representing the game status
        (waiting for players, in progress, over, etc.)
    "cid": String. ID assigned to the game.
    "player_won": Int. If a player won, this is the index of the player that won
        Otherwise, it is -1.
}
*/

class Challenge {
  game_name = "";
  game_state = null;
  game_end = null;
  players = [];
  status = "";
  cid = "";
  moves = [];

  constructor(data) {
    makeObservable(this, {
      game_state: observable,
      players: observable,
      status: observable,
      game_end: observable,
      moves: observable,
      is_playing: computed,
      update_challenge_information: action,
    });
    this.cid = data.cid;
    this.game_name = data.game_name;
    this.game_state = new game_name_to_state_class[this.game_name](
      this,
      data.state.config
    );

    this.update_challenge_information(data);

    this.ViewComponent = game_name_to_view_component[this.game_name];
  }

  get is_playing() {
    return this.status == "IN_PROGRESS";
  }

  update_challenge_information(new_chall) {
    this.players = new_chall.players;
    this.status = new_chall.status;
    this.game_end = new_chall.player_won;
    this.moves = new_chall.moves;
    this.game_state.update_game_information(new_chall.state);
  }

  turn_of_user = (user_id) => {
    // 0-indexed player turn (ie. 1st player = 0, 2nd player = 1, ...)
    // -1 if not a player
    return this.players.findIndex((player_id) => player_id === user_id);
  };
}

export { Challenge };
