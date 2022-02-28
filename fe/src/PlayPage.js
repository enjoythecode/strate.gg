import { observer } from "mobx-react";
import React, { useEffect } from "react";
import RootStore from "./RootStore.js";
import { ChallengeView } from "./Challenge.js";

function get_game_id_from_url() {
  let params = new URLSearchParams(window.location.search);
  console.log(params.keys());
  return params.get("cid");
}
/*
// TODO: remove this
const PlayPage2 = observer(
  class PlayPage extends React.Component {
    constructor() {
      super();
      this.cid = get_game_id_from_url();
      RootStore.socket.join_challenge(this.cid);
    }

    render() {
      return <ChallengeView challenge={RootStore.challenges.get(this.cid)} />;
    }
  }
);
*/

const PlayPage = observer(() => {
  let cid = get_game_id_from_url();

  useEffect(() => {
    RootStore.socket.challenge_subscribe(cid);

    return function cleanup() {
      RootStore.socket.challenge_unsubscribe(cid);
    };
  }, [cid]);

  return <ChallengeView challenge={RootStore.challenges.get(cid)} />;
});

export default PlayPage;
