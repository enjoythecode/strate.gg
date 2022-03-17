import { observer } from "mobx-react-lite";
import { useRootStore } from "../../Store/RootStore.js";
import UserNametag from "../../Components/UserNametag";
import { MoveList } from "./MoveList";
import { ChallengeDashboardPlayerTag } from "./ChallengeDashboardPlayerTag";
import { StatusIndicator } from "./StatusIndicator";
import { AmazonsLogic } from "../../Games/Amazons/AmazonsLogic.js";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

export default observer(function ChallengeDashboard({ challenge }) {
  const RootStore = useRootStore();

  let join_as_player2_button = (
    <Button
      variant="contained"
      disabled={challenge.players.includes(RootStore.client_uid)}
      onClick={() => {
        RootStore.socket.join_challenge(challenge.cid);
      }}
    >
      Join as Player 2
    </Button>
  );
  return (
    <Paper sx={{ padding: 2 }}>
      <Box>
        <ChallengeDashboardPlayerTag
          isTurn={challenge.game_state.turn === 1 && challenge.is_playing}
          colorBadge={challenge.game_state.turn_to_identity[1].badge}
        >
          {challenge.players.length < 2 ? (
            join_as_player2_button
          ) : (
            <UserNametag userId={challenge.players[1]} />
          )}
        </ChallengeDashboardPlayerTag>
      </Box>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }}></Divider>
      <MoveList
        moves={challenge.moves.map(
          (move) => AmazonsLogic.format_move_for_human(move) /* XXX */
        )}
      />

      <StatusIndicator status={challenge.status} end={challenge.game_end} />
      <Divider sx={{ marginTop: 1, marginBottom: 1 }}></Divider>
      <Box>
        <ChallengeDashboardPlayerTag
          isTurn={challenge.game_state.turn === 0 && challenge.is_playing}
          colorBadge={challenge.game_state.turn_to_identity[0].badge}
        >
          <UserNametag userId={challenge.players[0]} />
        </ChallengeDashboardPlayerTag>
      </Box>
    </Paper>
  );
});
