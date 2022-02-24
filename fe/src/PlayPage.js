import { observer } from "mobx-react";
import React from "react";
import RootStore from "./RootStore.js";
import { ChallengeView } from "./Challenge.js";

function get_game_id() {
  let params = new URLSearchParams(window.location.search);
  return params.get("cid");
}

const PlayPage = observer(
  class PlayPage extends React.Component {
    constructor() {
      super();
      this.cid = get_game_id();
      RootStore.socket.join_challenge(this.cid);
    }

    render() {
      return <ChallengeView challenge={RootStore.challenges.get(this.cid)} />;
    }
  }
);

export default PlayPage;
