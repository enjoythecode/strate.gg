import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { Challenge } from "./Challenge";
import { ChallengeView } from "./ChallengeView";
import { RootStoreProvider, initRootStoreAndSocket } from "../Store/RootStore";
import { SoundBridge } from "../Sound/SoundBridge";

import { NEW_AMAZONS_CHALLENGE_DATA } from "./Challenge.test";
import { AMAZONS_CHALLENGE_DATA_AFTER_MOVE } from "./Challenge.test";

const createFreshRootStore = () => {
  const RootStore = initRootStoreAndSocket();
  return RootStore;
};

const createFreshAmazonsChallenge = () => {
  return new Challenge(NEW_AMAZONS_CHALLENGE_DATA);
};

const createAmazonsChallengeWithOneMove = () => {
  return new Challenge(AMAZONS_CHALLENGE_DATA_AFTER_MOVE);
};

const renderChallenge = (challenge, RootStore = null) => {
  if (RootStore === null) {
    RootStore = createFreshRootStore();
  }

  const { asFragment } = render(
    <RootStoreProvider store={RootStore}>
      <ChallengeView challenge={challenge}></ChallengeView>
    </RootStoreProvider>
  );

  return asFragment();
};

describe("ChallengeView", () => {
  it("renders text when it does not have challenge data", () => {
    render(<ChallengeView></ChallengeView>);
    let chall_view = screen.getByTestId("challenge");

    expect(chall_view.textContent).toBe("Loading the game!");
  });

  it("renders challenge with challenge data", () => {
    let chall_view = renderChallenge(createFreshAmazonsChallenge());
    expect(chall_view).toMatchSnapshot();
  });

  it("renders challenge with at least one move and the last move indicator", () => {
    let chall_view = renderChallenge(createAmazonsChallengeWithOneMove());
    expect(chall_view).toMatchSnapshot();
  });
});

describe("new move sound effect", () => {
  beforeEach(() => {
    SoundBridge.mockClear();
  });

  it("plays a sound when challenge is updated with a new move", () => {
    const challenge = createFreshAmazonsChallenge();
    renderChallenge(challenge);

    act(() => {
      // makes sure all updates are flushed before moving to the next line
      challenge.update_challenge_information(AMAZONS_CHALLENGE_DATA_AFTER_MOVE);
    });

    expect(
      SoundBridge.mock.instances[0].playMoveSoundEffect.mock.calls.length
    ).toBe(1);
  });

  describe("is not triggered when", () => {
    afterEach(() => {
      expect(
        SoundBridge.mock.instances[0].playMoveSoundEffect
      ).not.toHaveBeenCalled();
    });

    it("initial, fresh render", () => {
      renderChallenge(createFreshAmazonsChallenge());
    });

    it("initial render of a in-progress game with moves", () => {
      renderChallenge(createAmazonsChallengeWithOneMove());
    });

    it("challenge is updated without a move", () => {
      const challenge = createFreshAmazonsChallenge();
      renderChallenge(challenge);

      act(() => {
        // makes sure all updates are flushed before moving to the next line
        challenge.update_challenge_information({
          ...NEW_AMAZONS_CHALLENGE_DATA,
          status: "OVER_DISCONNECT",
        });
      });
    });
  });
});
