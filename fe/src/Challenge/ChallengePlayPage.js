import { observer } from "mobx-react";
import React, { useEffect } from "react";
import RootStore from "../Store/RootStore.js";
import { ChallengeView } from "./ChallengeView.js";

function get_game_id_from_url() {
  let params = new URLSearchParams(window.location.search);
  console.log(params.keys());
  return params.get("cid");
}

const ChallengePlayPage = observer(() => {
  let cid = get_game_id_from_url();

  useEffect(() => {
    RootStore.socket.challenge_subscribe(cid);

    return function cleanup() {
      RootStore.socket.challenge_unsubscribe(cid);
    };
  }, [cid]);

  return <ChallengeView challenge={RootStore.challenges.get(cid)} />;
});

export default ChallengePlayPage;