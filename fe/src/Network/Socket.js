import io from "socket.io-client";
import { makeObservable, observable, action } from "mobx";

export const CONNECTION_STATUS_ENUM = {
  CONNECTING: 1,
  ONLINE: 2,
  OFFLINE: 3,
};

class Socket {
  active_users = 0;
  connection_status = "offline";

  constructor(RootStore) {
    makeObservable(this, {
      active_users: observable,
      set_active_users: action,

      connection_status: observable,
      set_connection_status: action,
    });
    this.io = null;
    this.RootStore = RootStore;
  }

  set_active_users = (new_active_users) => {
    this.active_users = new_active_users;
  };
  set_connection_status = (new_connection_status) => {
    this.connection_status = new_connection_status;
  };

  connect = () => {
    let host_is_development =
      (window.location.hostname === "127.0.0.1") |
      (window.location.hostname === "localhost");
    let options = { withCredentials: true };

    this.io = io(host_is_development ? "localhost" : "strate.gg", options);

    this.bind_socket_listeners();
    this.set_connection_status(CONNECTION_STATUS_ENUM.CONNECTING);
  };

  bind_socket_listeners = () => {
    this.io.on("connect", () => {
      this.set_connection_status(CONNECTION_STATUS_ENUM.ONLINE);
    });

    this.io.on("disconnect", (data) => {
      this.set_connection_status(CONNECTION_STATUS_ENUM.OFFLINE);
    });

    this.io.on("connection-player-id", (data) => {
      this.RootStore.set_client_uid(data["uid"]);
    });

    this.io.on("connection-info-update", (data) => {
      this.set_active_users(data.users);
    });

    this.io.on("challenge-update", (data) => {
      if ("result" in data && data.result === "success") {
        this.RootStore.update_challenge_information(data.challenge);
      }
    });
  };

  create_new_challenge = (payload) => {
    this.io.emit("challenge-create", payload, (data) => {
      if (data.result && data.result === "success") {
        window.location.replace(
          "/play/" + data.challenge.game_name + "?cid=" + data.challenge.cid
        );
      }
    });
  };

  join_challenge = (cid) => {
    this.io.emit("challenge-join", { cid: cid }, (data) => {
      if ("result" in data && data.result === "success") {
        this.RootStore.update_challenge_information(data.challenge);
      }
    });
  };

  challenge_subscribe = (cid) => {
    this.io.emit("challenge-subscribe", { cid: cid });
  };

  challenge_unsubscribe = (cid) => {
    this.io.emit("challenge-unsubscribe", { cid: cid });
  };

  challenge_send_move = (payload) => {
    this.io.emit("challenge-move", payload);
  };
}

export default Socket;
