import React from "react";
import { toJS } from "mobx";
import { observer } from "mobx-react";

import { useRootStore } from "Store/RootStore.js";
import ChallengeDashboard from "Challenge/Components/ChallengeDashboard";

import Grid from "@mui/material/Grid";

const ChallengeView = observer(({ challenge, move_handler }) => {
  const RootStore = useRootStore();

  let game_is_in_progress = challenge.status === "IN_PROGRESS";
  let is_users_turn =
    challenge.game_state.turn === challenge.turn_of_user(RootStore.client_uid);
  let player_can_move = game_is_in_progress && is_users_turn;

  return (
    <div data-testid="challenge">
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={7}>
          <challenge.ViewComponent
            game_state={challenge.game_state}
            handle_move={player_can_move ? move_handler : undefined}
            last_move={
              challenge.moves.length > 0
                ? toJS(challenge.moves[challenge.moves.length - 1])
                : undefined
            }
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <ChallengeDashboard challenge={challenge} />
        </Grid>
      </Grid>
    </div>
  );
});

export { ChallengeView };
