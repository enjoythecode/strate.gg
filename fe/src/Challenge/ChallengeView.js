import { observer } from "mobx-react";
import { toJS } from "mobx";
import React from "react";
import { useRootStore } from "../Store/RootStore.js";

import Grid from "@mui/material/Grid";

import ChallengeDashboard from "./Components/ChallengeDashboard";

const ChallengeView = observer(({ challenge, move_handler }) => {
  const RootStore = useRootStore();

  let game_is_in_progress = challenge.status === "IN_PROGRESS";
  let is_users_turn =
    challenge.game_state.turn === challenge.turn_of_user(RootStore.client_uid);
  let player_can_move = game_is_in_progress && is_users_turn;

  return (
    <div data-testid="challenge">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={7} lg={6} xl={6} sx={{ width: "100%" }}>
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
        <Grid item xs={12} sm={12} md={5} lg={4} xl={4}>
          <ChallengeDashboard challenge={challenge} />
        </Grid>
      </Grid>
    </div>
  );
});

export { ChallengeView };
