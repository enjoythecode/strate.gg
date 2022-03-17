import { renderComponentWithRootStore } from "../TestUtils";

import Footer from "./Footer";

describe("snapshots", () => {
  it("default footer", () => {
    const tree = renderComponentWithRootStore(<Footer />);
    expect(tree).toMatchSnapshot();
  });
});
