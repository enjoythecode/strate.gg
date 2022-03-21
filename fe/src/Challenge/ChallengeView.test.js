import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { Challenge } from "Challenge/Challenge";
import { ChallengeView } from "Challenge/ChallengeView";
import { RootStoreProvider, initRootStoreAndSocket } from "Store/RootStore";
import { SoundBridge } from "Sound/SoundBridge";

import { NEW_AMAZONS_CHALLENGE_DATA } from "Challenge/Challenge.test";
import { AMAZONS_CHALLENGE_DATA_AFTER_MOVE } from "Challenge/Challenge.test";
import { renderComponentWithRootStore } from "TestUtils";

const createFreshAmazonsChallenge = () => {
  return new Challenge(NEW_AMAZONS_CHALLENGE_DATA);
};

const createAmazonsChallengeWithOneMove = () => {
  return new Challenge(AMAZONS_CHALLENGE_DATA_AFTER_MOVE);
};

const renderChallenge = (challenge, RootStore = null) => {
  const component = <ChallengeView challenge={challenge} />;

  return renderComponentWithRootStore(component, RootStore);
};

describe("ChallengeView", () => {
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
