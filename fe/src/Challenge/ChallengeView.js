import { AmazonsLogic } from "../Games/Amazons/AmazonsLogic.js";
import { observer } from "mobx-react";
import RootStore from "../Store/RootStore.js";
import React from "react";
import { PlayerTagView } from "./Components/PlayerTagView";
import { MoveList } from "./Components/MoveList";
import { StatusIndicator } from "./Components/StatusIndicator";

const ChallengeView = observer(({ challenge }) => {
  let return_content;
  if (challenge == null) {
    return_content = "Loading the game!";
  } else {
    let game_is_in_progress = challenge.status === "IN_PROGRESS";
    let is_users_turn = challenge.game_state.turn === challenge.client_turn;
    let player_can_move = game_is_in_progress && is_users_turn;

    let handle_move_fn = (move) => {
      challenge.send_move(move);
    };

    return_content = (
      <div className="challenge-wrapper">
        <div className="challenge-board">
          <challenge.ViewComponent
            game_state={challenge.game_state}
            handle_move={player_can_move ? handle_move_fn : undefined}
            last_move={
              challenge.moves.length > 0
                ? challenge.moves[challenge.moves.length - 1]
                : undefined
            }
          />
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
          <></>
        )}
        <div className="challenge-dashboard">
          <div style={{ width: "100%" }}>
            <PlayerTagView
              displayName={
                challenge.players.length > 1 ? challenge.players[1] : null
              }
              isSelf={challenge.client_turn === 1}
              isTurn={challenge.game_state.turn === 1}
              colorBadge={challenge.game_state.turn_to_color[1].badge}
            />

            <MoveList
              moves={challenge.moves.map(
                (move) => AmazonsLogic.format_move_for_human(move) /* XXX */
              )}
            />
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
    );
  }

  return <div data-testid="challenge">{return_content}</div>;
});

export { ChallengeView };
