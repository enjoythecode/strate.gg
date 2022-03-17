import { observer } from "mobx-react-lite";
import { useRootStore } from "../../Store/RootStore.js";

import { MoveList } from "./MoveList";
import { PlayerTagView } from "./PlayerTagView";
import { StatusIndicator } from "./StatusIndicator";
import { AmazonsLogic } from "../../Games/Amazons/AmazonsLogic.js";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

export default observer(function ChallengeDashboard({ challenge }) {
  const RootStore = useRootStore();
  return (
    <Paper sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 3 }}>
        {challenge.players.length < 2 ? (
          <Button
            variant="contained"
            onClick={() => {
              RootStore.socket.join_challenge(challenge.cid);
            }}
          >
            Join as Player 2
          </Button>
        ) : (
          <PlayerTagView
            displayName={
              challenge.players.length > 1 ? challenge.players[1] : null
            }
            isSelf={challenge.turn_of_user(RootStore.client_uid) === 1}
            isTurn={challenge.game_state.turn === 1}
            colorBadge={challenge.game_state.turn_to_color[1].badge}
          />
        )}
      </Box>

      <MoveList
        moves={challenge.moves.map(
          (move) => AmazonsLogic.format_move_for_human(move) /* XXX */
        )}
      />

      <StatusIndicator status={challenge.status} end={challenge.game_end} />
      <Box sx={{ marginTop: 3 }}>
        <PlayerTagView
          displayName={challenge.players[0]}
          isSelf={challenge.turn_of_user(RootStore.client_uid) === 0}
          isTurn={challenge.game_state.turn === 0}
          colorBadge={challenge.game_state.turn_to_color[0].badge}
        />
      </Box>
    </Paper>
  );
});
