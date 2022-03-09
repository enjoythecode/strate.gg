import { AmazonsLogic } from "./AmazonsLogic";

let default_amazons_config = { size: 10, variation: 0 };

describe("AmazonsLogic", () => {
  it("can be initialized", () => {
    expect(new AmazonsLogic(null, default_amazons_config)).toBeDefined();
  });
});
