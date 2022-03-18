import { screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { createFreshRootStore, renderComponentWithRootStore } from "TestUtils";

import { SoundBridge } from "Sound/SoundBridge";
import EnableSoundToggle from "Store/Components/EnableSoundToggle";

let RootStore;

beforeEach(() => {
  SoundBridge.mockClear();
  RootStore = createFreshRootStore();
});

function setSoundEnabledToValueAndRenderSoundToggle(value) {
  act(() => {
    RootStore.preference_store.set_sound_enabled(value);
  });

  return renderComponentWithRootStore(<EnableSoundToggle />, RootStore);
}

describe("snapshots", () => {
  it("sound is ON", () => {
    const tree = setSoundEnabledToValueAndRenderSoundToggle(true);
    expect(tree).toMatchSnapshot();
  });

  it("sound is OFF", () => {
    const tree = setSoundEnabledToValueAndRenderSoundToggle(false);
    expect(tree).toMatchSnapshot();
  });
});

describe("the sound preference is toggled on click and a SFX is played on sound toggle ON only", () => {
  it("toggles the sound OFF from ON and does not trigger a SFX", () => {
    setSoundEnabledToValueAndRenderSoundToggle(true);
    act(() => {
      fireEvent.click(screen.getByLabelText("toggle sound off"));
    });
    expect(RootStore.preference_store.sound_enabled).toBe(false);
    expect(SoundBridge.mock.instances[0].playMoveSoundEffect).not.toBeCalled();
  });

  it("toggles the sound ON from OFF and triggers a SFX", () => {
    setSoundEnabledToValueAndRenderSoundToggle(false);
    act(() => {
      fireEvent.click(screen.getByLabelText("toggle sound on"));
    });
    expect(RootStore.preference_store.sound_enabled).toBe(true);
    expect(SoundBridge.mock.instances[0].playMoveSoundEffect).toBeCalledTimes(
      1
    );
  });
});
