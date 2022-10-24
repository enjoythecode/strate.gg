import App from "App";
import { render, screen } from "@testing-library/react";

import { RootStoreProvider, initRootStoreAndSocket } from "Store/RootStore";

const createFreshRootStore = () => {
  const RootStore = initRootStoreAndSocket();
  return RootStore;
};

describe("Main page", () => {
  it("it has a create challenge button", () => {
    render(<App></App>);
    let create_chall_button = screen.getByRole("button", {
      name: /create challenge/i,
    });
    expect(create_chall_button).toBeVisible();
  });

  xit("sends a network event when create challenge button is clicked", () => {
    const RootStore = createFreshRootStore();
    render(
      <RootStoreProvider store={RootStore}>
        <App></App>
      </RootStoreProvider>,
    );
    let create_chall_button = screen.getByRole("button", {
      name: /create challenge/i,
    });

    // TODO implement this test with a mock on the socket.
  });
});
