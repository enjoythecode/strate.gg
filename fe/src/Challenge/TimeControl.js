import { makeObservable, observable, action, computed } from "mobx";

class TimeControl {
  config = { base_s: 0, increment_s: 0 };
  move_timestamps = [];

  constructor(data) {
    makeObservable(this, {
      config: observable,
      move_timestamps: observable,
      update_time_control_data: action,
    });

    this.update_time_control_data(data);
  }
  update_time_control_data(data) {
    if (data !== undefined && data !== {}) {
      this.config = data.time_config;
      this.move_timestamps = data.move_timestamps;
    }
  }
  total_time_used_of_player(player) {
    if (this.move_timestamps === undefined) {
      return 0;
    }

    let used_time = 0;
    let first_ts_i = player == 0 ? 2 : 1;

    for (let i = first_ts_i; i < this.move_timestamps.length; i += 2) {
      used_time += this.move_timestamps[i] - this.move_timestamps[i - 1];
    }

    return used_time;
  }
}

export default TimeControl;
