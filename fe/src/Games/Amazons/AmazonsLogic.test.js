import { AmazonsLogic } from "./AmazonsLogic";

let default_amazons_config = { size: 10, variation: 0 };
let wrong_amazons_configs = [{}]; // TODO: add more wrong amazons configs

describe("AmazonsLogic", () => {
  it("can be initialized", () => {
    expect(new AmazonsLogic(null, default_amazons_config)).toBeDefined();
  });

  // TODO: parametrize
  it("throws on incorrect configuration", () => {
    expect(() => {
      new AmazonsLogic(null, wrong_amazons_configs[0]);
    }).toThrow();
  });

  describe(".cell_can_reach", () => {
    it("recognizes a reachable cell", () => {
      let al = new AmazonsLogic(null, default_amazons_config); // TODO/XXX: add to beforeEach or similar mechanism?
      expect(al.cell_can_reach("03", "83")).toBe(true);
    });

    it("recognizes an unreachable cell", () => {
      let al = new AmazonsLogic(null, default_amazons_config);
      expect(al.cell_can_reach("03", "09")).toBe(false);
    });

    it("recognizes a cell that is only reachable due to the ignore", () => {
      let al = new AmazonsLogic(null, default_amazons_config);
      expect(al.cell_can_reach("04", "02", "03")).toBe(true);
    });
  });
});
