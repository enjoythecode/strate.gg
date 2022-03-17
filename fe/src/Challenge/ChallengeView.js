import { observer } from "mobx-react";
import { toJS } from "mobx";
import React from "react";

import { useRootStore } from "../Store/RootStore.js";

import ChallengeDashboard from "./Components/ChallengeDashboard";

const ChallengeView = observer(({ challenge, move_handler }) => {
  const RootStore = useRootStore();
  let return_content;

  if (challenge == null) {
    return_content = "Loading the game!";
  } else {
    let game_is_in_progress = challenge.status === "IN_PROGRESS";
    let is_users_turn =
      challenge.game_state.turn ===
      challenge.turn_of_user(RootStore.client_uid);
    let player_can_move = game_is_in_progress && is_users_turn;

    return_content = (
      <div className="challenge-wrapper">
        <div className="challenge-board">
          <challenge.ViewComponent
            game_state={challenge.game_state}
            handle_move={player_can_move ? move_handler : undefined}
            last_move={
              challenge.moves.length > 0
                ? toJS(challenge.moves[challenge.moves.length - 1])
                : undefined
            }
          />
        </div>
        <ChallengeDashboard challenge={challenge} />
      </div>
    );
  }

  return <div data-testid="challenge">{return_content}</div>;
});

export { ChallengeView };
