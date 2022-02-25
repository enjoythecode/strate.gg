import io from "socket.io-client";
import RootStore from "./RootStore.js";
import { makeObservable, observable, action } from "mobx";

class Socket {
  active_users = 0;
  connection_status = "offline";

  constructor() {
    makeObservable(this, {
      active_users: observable,
      set_active_users: action,

      connection_status: observable,
      set_connection_status: action,
    });
    this.io = null;
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
    this.io = io(host_is_development ? "localhost:8080" : "strate.gg", options);
    // Pondering: Can this line ever be slow enough (or light travel fast enough) where the "connect" event happens before it is binded?
    // Answer: very, very, very unlikely. It is both light, and one is traveling (at least) hundreds of miles.
    this.bind_socket_listeners();
    this.set_connection_status("connecting");
  };

  bind_socket_listeners = () => {
    this.io.on("connect", () => {
      this.set_connection_status("online");
    });

    this.io.on("disconnect", (data) => {
      this.set_connection_status("offline");
    });

    this.io.on("connection-player-id", (data) => {
      RootStore.set_client_uid(data["uid"]);
    });

    this.io.on("connection-info-update", (data) => {
      this.set_active_users(data.users);
    });

    this.io.on("game-update-move", (data) => {
      RootStore.update_challenge_new_move(data);
    });

    this.io.on("game-update-meta", (data) => {
      if ("result" in data && data.result === "success") {
        RootStore.update_challenge_information(data.info);
      }
    });
  };

  create_new_game = (payload) => {
    this.io.emit("game-create", payload, (data) => {
      if (data.result && data.result === "success") {
        RootStore.update_challenge_information(data);
        window.location.replace("/play/" + data.game_name + "?cid=" + data.cid);
      }
    });
  };

  join_challenge = (cid) => {
    this.io.emit("game-join", { cid: cid }, (data) => {
      if ("result" in data && data.result === "success") {
        RootStore.update_challenge_information(data.info);
      }
    });
  };

  send_move = (payload) => {
    this.io.emit("game-move", payload);
  };

  poll_tv_games(payload, successCallback) {
    this.io.emit("tv-poll", payload, (data) => {
      if ("result" in data && data.result === "success") {
        successCallback(data);
      }
    });
  }
}

export default Socket;
