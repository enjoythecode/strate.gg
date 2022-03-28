import TimeControl from "./TimeControl";

const BASE_CONFIG = {
  time_config: {
    base_s: 600,
    increment_s: 5,
  },
  move_timestamps: [],
};

describe("TimeControl initialization", () => {
  it("can be initialized without any data", () => {
    const tc = new TimeControl();
  });
  it("can be initialized with time control data", () => {
    const tc = new TimeControl(BASE_CONFIG);
  });
  it("can be updated with new time control data", () => {
    const tc = new TimeControl();
    tc.update_time_control_data(BASE_CONFIG);
  });
});

describe("TimeControl fields", () => {
  describe("player_total_time_used", () => {
    it("is 0 for no moves", () => {
      const tc = new TimeControl(BASE_CONFIG);
      expect(tc.total_time_used_of_player(0)).toBe(0);
    });
    it("is 0 for white after black played their first move", () => {
      const tc = new TimeControl({
        ...BASE_CONFIG,
        move_timestamps: [100, 105],
      });
      expect(tc.total_time_used_of_player(0)).toBe(0);
    });
    it("calculates for black after blacks first move", () => {
      const tc = new TimeControl({
        ...BASE_CONFIG,
        move_timestamps: [100, 105],
      });
      expect(tc.total_time_used_of_player(1)).toBe(5);
    });
    it("calculates correctly after multiple moves by each player", () => {
      const tc = new TimeControl({
        ...BASE_CONFIG,
        move_timestamps: [100, 105, 115, 120, 130, 135, 145],
      });
      expect(tc.total_time_used_of_player(0)).toBe(30);
      expect(tc.total_time_used_of_player(1)).toBe(15);
    });
  });
  describe("remaining_time_of_player", () => {
    it("is the base time when no moves were made", () => {
      const tc = new TimeControl(BASE_CONFIG);
      expect(tc.remaining_time_of_player(0)).toBe(
        BASE_CONFIG.time_config.base_s
      );
    });
    it("is the base time for white after two moves", () => {
      const tc = new TimeControl({
        ...BASE_CONFIG,
        move_timestamps: [100, 105],
      });
      expect(tc.remaining_time_of_player(0)).toBe(
        BASE_CONFIG.time_config.base_s
      );
    });
    it("is the time used - increment for black after two moves", () => {
      const tc = new TimeControl({
        ...BASE_CONFIG,
        move_timestamps: [100, 107],
      });
      expect(tc.remaining_time_of_player(1)).toBe(
        BASE_CONFIG.time_config.base_s + BASE_CONFIG.time_config.increment_s - 7
      );
    });
    it("is only (increment - second move time) for white after three moves", () => {
      const tc = new TimeControl({
        ...BASE_CONFIG,
        move_timestamps: [100, 110, 123],
      });
      expect(tc.remaining_time_of_player(0)).toBe(
        BASE_CONFIG.time_config.base_s +
          BASE_CONFIG.time_config.increment_s -
          13
      );
    });
  });
});
