import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useRootStore } from "../Store/RootStore.js";
import { ChallengeView } from "./ChallengeView.js";

function get_game_id_from_url() {
  let params = new URLSearchParams(window.location.search);
  console.log(params.keys());
  return params.get("cid");
}

const ChallengePlayPage = observer(() => {
  let cid = get_game_id_from_url();
  const RootStore = useRootStore();

  useEffect(() => {
    RootStore.socket.challenge_subscribe(cid);

    return function cleanup() {
      RootStore.socket.challenge_unsubscribe(cid);
    };
  }, [cid]);

  return (
    <ChallengeView
      challenge={RootStore.challenges.get(cid)}
      move_handler={(move) =>
        RootStore.socket.challenge_send_move({ cid: cid, move: move })
      }
    />
  );
});

export default ChallengePlayPage;
