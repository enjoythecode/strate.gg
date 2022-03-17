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

/* player is 0-indexed turn. */
const ChallengeDashboardPlayerComponent = observer(({ challenge, player }) => {
  const RootStore = useRootStore();
  return (
    <Box>
      <ChallengeDashboardPlayerTag
        isTurn={challenge.game_state.turn === player && challenge.is_playing}
        colorBadge={challenge.game_state.turn_to_identity[player].badge}
      >
        {challenge.players.length < player + 1 ? (
          <Button
            variant="contained"
            disabled={challenge.players.includes(RootStore.client_uid)}
            onClick={() => {
              RootStore.socket.join_challenge(challenge.cid);
            }}
          >
            Join game as {challenge.game_state.turn_to_identity[player].name}
          </Button>
        ) : (
          <UserNametag userId={challenge.players[player]} />
        )}
      </ChallengeDashboardPlayerTag>
    </Box>
  );
});

const DividerWithMargin = () => (
  <Divider sx={{ marginTop: 1, marginBottom: 1 }}></Divider>
);

export default observer(function ChallengeDashboard({ challenge }) {
  return (
    <Paper sx={{ padding: 2 }}>
      <ChallengeDashboardPlayerComponent challenge={challenge} player={1} />
      <DividerWithMargin />

      <MoveList
        moves={challenge.moves.map(
          (move) => AmazonsLogic.format_move_for_human(move) /* XXX */
        )}
      />
      <StatusIndicator status={challenge.status} end={challenge.game_end} />

      <DividerWithMargin />
      <ChallengeDashboardPlayerComponent challenge={challenge} player={0} />
    </Paper>
  );
});
