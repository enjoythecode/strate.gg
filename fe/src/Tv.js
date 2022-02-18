import { makeObservable, observable, action, when } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import RootState from "./State.js";
import { ChallengeView } from "./Challenge.js";

const Tv = observer(
  class Tv extends React.Component {
    cid = null;

    constructor() {
      super();
      makeObservable(this, {
        cid: observable,
        update_cid: action,
      });
    }

    componentDidMount() {
      this.poller = setInterval(() => this.poll_for_games(), 2500);
    }

    update_cid(cid) {
      this.cid = cid;
    }

    poll_for_games() {
      let noChallenge = this.cid === null;
      let challengeNotPlaying =
        !noChallenge &&
        RootState.challenges.has(this.cid) &&
        RootState.challenges.get(this.cid).status !== "IN_PROGRESS";

      if (noChallenge || challengeNotPlaying) {
        RootState.socket.poll_tv_games({}, (data) => {
          this.update_cid(data.cid);
          RootState.socket.join_challenge(data.cid);
          this.dispose_game_end_watcher = when(
            () => {
              return (
                this.cid !== null &&
                RootState.challenges.has(this.cid) &&
                RootState.challenges.get(this.cid).status !== "IN_PROGRESS"
              );
            },
            () => {
              this.update_cid(null);
            }
          );
        });
      }
    }

    componentWillUnmount() {
      clearInterval(this.poller);
      this.poller = null;
      console.log("d: ", this.dispose_game_end_watcher);
      if (typeof this.dispose_game_end_watcher !== "undefined") {
        this.dispose_game_end_watcher();
      }
    }

    render() {
      return (
        <div style={{ border: "solid", display: "block" }}>
          <h1>TV! {this.cid} </h1>
          {this.cid !== null ? (
            <ChallengeView challenge={RootState.challenges.get(this.cid)} />
          ) : (
            "Looking for a game to watch!"
          )}
        </div>
      );
    }
  }
);

export default Tv;
