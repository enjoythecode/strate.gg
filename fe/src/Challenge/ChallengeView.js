import { AmazonsLogic } from "../Games/Amazons/AmazonsLogic.js";
import { observer } from "mobx-react";
import RootStore from "../Store/RootStore.js";
import React from "react";
import { PlayerTagView, MoveList, StatusIndicator } from "./Challenge";

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
      </div>
    )}
  </div>
));

export { ChallengeView };
