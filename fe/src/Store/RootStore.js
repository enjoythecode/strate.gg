import { makeObservable, observable, action } from "mobx";
import { Challenge } from "../Challenge/Challenge.js";
import Socket from "../Network/Socket.js";
import React from "react";
import PreferenceStore from "./PreferenceStore.js";
import { SoundBridge } from "../Sound/SoundBridge";

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
    this.preference_store = new PreferenceStore();
    this.sound_bridge = new SoundBridge(this);
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

    if (!chs.has(cid)) {
      chs.set(cid, new Challenge(challenge));
    }
    chs.get(cid).update_challenge_information(challenge);
  };
}

//  Store helpers from https://codingislove.com/setup-mobx-react-context/
const RootStoreContext = React.createContext();

export const initRootStoreAndSocket = () => {
  const RootStore = new _RootStore();
  const socket = new Socket(RootStore);
  RootStore.set_socket(socket);
  return RootStore;
};

export const RootStoreProvider = ({ children, store }) => {
  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = () => React.useContext(RootStoreContext);
