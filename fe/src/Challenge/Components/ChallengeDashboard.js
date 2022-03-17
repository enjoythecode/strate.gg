import { observer } from "mobx-react-lite";
import { useRootStore } from "../../Store/RootStore.js";

import { MoveList } from "./MoveList";
import { PlayerTagView } from "./PlayerTagView";
import { StatusIndicator } from "./StatusIndicator";

import { AmazonsLogic } from "../../Games/Amazons/AmazonsLogic.js";

export default observer(function ChallengeDashboard({ challenge }) {
  const RootStore = useRootStore();
  return (
    <div className="challenge-dashboard">
      <div>
        {challenge.players.length < 2 ? (
          <button
            onClick={() => {
              RootStore.socket.join_challenge(challenge.cid);
            }}
          >
            Join!
          </button>
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

        <MoveList
          moves={challenge.moves.map(
            (move) => AmazonsLogic.format_move_for_human(move) /* XXX */
          )}
        />
        <StatusIndicator status={challenge.status} end={challenge.game_end} />

        <PlayerTagView
          displayName={challenge.players[0]}
          isSelf={challenge.turn_of_user(RootStore.client_uid) === 0}
          isTurn={challenge.game_state.turn === 0}
          colorBadge={challenge.game_state.turn_to_color[0].badge}
        />
      </div>
    </div>
  );
});
