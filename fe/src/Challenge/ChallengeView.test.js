import { ChallengeView } from "./ChallengeView";
import { render, screen } from "@testing-library/react";
import { Challenge } from "./Challenge";
import { NEW_AMAZONS_CHALLENGE_DATA } from "./Challenge.test";

describe("ChallengeView", () => {
  it("renders text when it does not have challenge data", () => {
    render(<ChallengeView></ChallengeView>);
    let chall_view = screen.getByTestId("challenge");

    expect(chall_view.textContent).toBe("Loading the game!");
  });

  it("renders challenge with challenge data", () => {
    const challenge = new Challenge(NEW_AMAZONS_CHALLENGE_DATA);

    const { asFragment } = render(
      <ChallengeView challenge={challenge}></ChallengeView>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
