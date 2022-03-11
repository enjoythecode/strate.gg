import { makeObservable, observable, action } from "mobx";
import { Challenge } from "../Challenge/Challenge.js";
import Socket from "../Network/Socket.js";

class _RootStore {
  challenges = observable.map({});
  // user ID of this client, used to distinguish from other players
  client_uid = undefined;

  constructor() {
    makeObservable(this, {
      challenges: observable,
      client_uid: observable,
      set_client_uid: action,
      update_challenge_information: action,
    });
  }

  set_socket = (sckt) => {
    this.socket = sckt;
  };

  set_client_uid = (new_uid) => {
    this.client_uid = new_uid;
    console.info("Client UID is ", new_uid);
  };

  update_challenge_information = (challenge) => {
    let cid = challenge.cid;
    let chs = this.challenges;
    console.log(JSON.stringify(challenge));

    if (!chs.has(cid)) {
      chs.set(cid, new Challenge(challenge));
    }
    chs.get(cid).update_challenge_information(challenge);
  };
}

// we create all of our stores, socket IO class
// and export them from this module to make it available to access
// from every file without using React Contexts
const RootStore = new _RootStore();
const socket = new Socket();
RootStore.set_socket(socket);

export default RootStore;
