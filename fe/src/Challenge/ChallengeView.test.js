import { Challenge } from "./Challenge";
import { ChallengeView } from "./ChallengeView";

import { render, screen } from "@testing-library/react";

import { RootStoreProvider, initRootStoreAndSocket } from "../Store/RootStore";

import { NEW_AMAZONS_CHALLENGE_DATA } from "./Challenge.test";
import { AMAZONS_CHALLENGE_DATA_AFTER_MOVE } from "./Challenge.test";

const createFreshRootStore = () => {
  const RootStore = initRootStoreAndSocket();
  return RootStore;
};

describe("ChallengeView", () => {
  it("renders text when it does not have challenge data", () => {
    render(<ChallengeView></ChallengeView>);
    let chall_view = screen.getByTestId("challenge");

    expect(chall_view.textContent).toBe("Loading the game!");
  });

  it("renders challenge with challenge data", () => {
    const fresh_challenge = new Challenge(NEW_AMAZONS_CHALLENGE_DATA);
    const RootStore = createFreshRootStore();

    const { asFragment } = render(
      <RootStoreProvider store={RootStore}>
        <ChallengeView challenge={fresh_challenge}></ChallengeView>
      </RootStoreProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders challenge with at least one move and the last move indicator", () => {
    const challenge_with_one_move = new Challenge(
      AMAZONS_CHALLENGE_DATA_AFTER_MOVE
    );
    const RootStore = createFreshRootStore();

    const { asFragment } = render(
      <RootStoreProvider store={RootStore}>
        <ChallengeView challenge={challenge_with_one_move}></ChallengeView>
      </RootStoreProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
