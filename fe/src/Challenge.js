import { makeObservable, observable, action, computed } from "mobx";
import { Amazons, AmazonsView } from "./Games/Amazons";
import { Mancala, MancalaView } from "./Games/Mancala";
import { observer } from "mobx-react";
import RootStore from "./RootStore.js";
import React from "react";

const game_name_to_state_class = {
  amazons: Amazons,
  mancala: Mancala,
};

const game_name_to_view_component = {
  amazons: AmazonsView,
  mancala: MancalaView,
};

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
      update_challenge_information: action,
      client_turn: computed,
    });
    this.cid = data.cid;
    this.game_name = data.game_name;
    this.game_end = 0;
    this.game_state = new game_name_to_state_class[this.game_name](
      this,
      data.state.config
    );
    this.ViewComponent = game_name_to_view_component[this.game_name];
  }

  send_move(move) {
    RootStore.socket.challenge_send_move({ cid: this.cid, move: move });
  }

  update_challenge_information(new_chall) {
    this.players = new_chall.players;
    this.status = new_chall.status;
    this.game_end = 0; // TODO: XXX: broken because this is not represented in the backend
    this.moves = new_chall.moves;
    this.game_state.update_game_information(new_chall.state);
  }

  get client_turn() {
    // 0-indexed player turn (ie. 1st player = 0, 2nd player = 1, ...), -1 if not a player
    return this.players.findIndex(
      (player_id) => player_id === RootStore.client_uid
    );
  }
}

const PlayerTagView = (props) => {
  let spanClasses = ["player-tag"];
  if (props.isSelf) {
    spanClasses.push("player-tag-self");
  }

  let divClasses = ["challenge-dashboard-player"];

  if (props.isTurn) {
    divClasses.push("challenge-dashboard-player-hasTurn");
  }

  let display;
  if (typeof props.displayName !== "undefined") {
    display = "Guest #" + props.displayName.slice(0, 7);
  } else {
    display = "Waiting for opponent...";
  }

  return (
    <div
      className={divClasses.join(" ")}
      style={{
        display: "flex",
        alignContent: "center",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: "30px", maxHeight: "30px", marginRight: "5px" }}>
        {props.colorBadge}
      </div>
      <span className={spanClasses.join(" ")}>{display}</span>
    </div>
  );
};

const MoveList = (props) => {
  let rendered_moves = [];

  for (let index = 0; index < props.moves.length; index++) {
    const move = props.moves[index];

    rendered_moves.push(
      <div
        style={{
          display: "flex",
          alignContent: "center",
          textAlign: "center",
          alignItems: "center",
        }}
        key={index}
      >
        {index + 1}.
        <div
          style={{ maxWidth: "22px", maxHeight: "22px", marginRight: "4px" }}
        >
          {move.human.color.badge}
        </div>
        <span>{move.human.formatted_move}</span>
      </div>
    );
  }

  // https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up
  if (props.moves.length !== 0) {
    return (
      <div
        style={{
          maxHeight: "11em",
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse",
          fontFamily: "monospace",
          padding: "1em",
        }}
      >
        <div>{rendered_moves}</div>
      </div>
    );
  } else {
    return null;
  }
};

const StatusIndicator = (props) => {
  let text = "";
  let els = [];
  switch (props.status) {
    case "WAITING_FOR_PLAYERS":
      text = "Waiting for players to join...";
      break;
    case "OVER_NORMAL":
      text = "Game over.";
      break;
    case "OVER_DISCONNECT":
      text = "Game over due to disconnect.";
      break;
    case "OVER_TIME":
      text = "Game over due to time out.";
      break;
    case "IN_PROGRESS":
      text = false;
      break;
    default:
      throw new Error("Unknown status code:" + props.status);
  }

  if (text) {
    els.push(<em key={0}>{text}</em>);
  }

  if (props.end !== 0) {
    els.push(<br key={1} />);
    switch (props.end) {
      case 1:
        els.push(<em key={2}>White wins. 1 - 0</em>);
        break;
      case 2:
        els.push(<em key={2}>Black wins. 0 - 1</em>);
        break;
      case -2:
        els.push(<em key={2}>Draw. ½ - ½</em>);
        break;
      default:
        throw new Error("Unknown status code" + props.end);
    }
  }

  return (
    <div style={{ textAlign: "center", display: "block", margin: "1em" }}>
      {els}
    </div>
  );
};

const ChallengeView = observer(({ challenge }) => (
  <div>
    {challenge == null ? (
      "Loading the game!"
    ) : (
      <div>
        <div className="challenge-wrapper">
          <div className="challenge-board">
            <challenge.ViewComponent game_state={challenge.game_state} />
          </div>
          {challenge.players.length < 2 ? (
            <button
              onClick={() => {
                RootStore.socket.join_challenge(challenge.cid);
              }}
            >
              Join!
            </button>
          ) : (
            <none></none>
          )}
          <div className="challenge-dashboard">
            <div style={{ width: "100%" }}>
              <PlayerTagView
                displayName={challenge.players[1]}
                isSelf={challenge.client_turn === 1}
                isTurn={challenge.game_state.turn === 1}
                colorBadge={challenge.game_state.turn_to_color[1].badge}
              />

              <MoveList moves={challenge.moves} />
              <StatusIndicator
                status={challenge.status}
                end={challenge.game_end}
              />

              <PlayerTagView
                displayName={challenge.players[0]}
                isSelf={challenge.client_turn === 0}
                isTurn={challenge.game_state.turn === 0}
                colorBadge={challenge.game_state.turn_to_color[0].badge}
              />
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
));

export { Challenge, ChallengeView };
