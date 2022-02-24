import { makeObservable, observable, action } from "mobx";
import { Challenge } from "./Challenge.js";
import Socket from "./Socket.js";

class _RootStore {
  challenges = observable.map({});
  // user ID of this client, used to distinguish from other players
  client_user_id = undefined;

  constructor() {
    makeObservable(this, {
      challenges: observable,
      update_challenge_information: action,
    });
  }

  set_socket = (sckt) => {
    this.socket = sckt;
  };

  update_challenge_information = (data) => {
    let cid = data.cid;
    let chs = this.challenges;

    if (!chs.has(cid)) {
      chs.set(cid, new Challenge(data));
    }
    chs.get(cid).update_challenge_information(data);
  };

  update_challenge_new_move = (data) => {
    let cid = data.cid;
    if (this.challenges.has(cid)) {
      this.challenges.get(cid).process_new_move(data);
    }
  };
}

// we create all of our stores, socket IO class
// and export them from this module to make it available to access
// from every file without using React Contexts
const RootStore = new _RootStore();
const socket = new Socket();
RootStore.set_socket(socket);

export default RootStore;
