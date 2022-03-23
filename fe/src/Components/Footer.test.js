import { renderComponentWithRootStore } from "TestUtils";

import Footer from "Components/Footer";

describe("snapshots", () => {
  it("default footer", () => {
    const tree = renderComponentWithRootStore(<Footer />);
    expect(tree).toMatchSnapshot();
  });
});
