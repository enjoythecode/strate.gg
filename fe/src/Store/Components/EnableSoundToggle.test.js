import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { RootStoreProvider, initRootStoreAndSocket } from "../RootStore";
import { SoundBridge } from "../../Sound/SoundBridge";
import EnableSoundToggle from "./EnableSoundToggle";

const renderComponentWithRootStore = (component, RootStore = null) => {
  if (RootStore === null) {
    RootStore = createFreshRootStore();
  }

  const { asFragment } = render(
    <RootStoreProvider store={RootStore}>{component}</RootStoreProvider>
  );

  return asFragment();
};

const createFreshRootStore = () => {
  const RootStore = initRootStoreAndSocket();
  return RootStore;
};

let RootStore;
beforeEach(() => {
  SoundBridge.mockClear();
  RootStore = createFreshRootStore();
});

describe("snapshots", () => {
  it("sound is ON", () => {
    act(() => {
      RootStore.preference_store.set_sound_enabled(true);
    });

    const tree = renderComponentWithRootStore(<EnableSoundToggle />, RootStore);
    expect(tree).toMatchSnapshot();
  });

  it("sound is OFF", () => {
    act(() => {
      RootStore.preference_store.set_sound_enabled(false);
    });
    const tree = renderComponentWithRootStore(<EnableSoundToggle />, RootStore);
    expect(tree).toMatchSnapshot();
  });
});

describe("the sound preference is toggled on click", () => {
  it("toggles the sound OFF from ON and does not trigger a SFX", () => {
    act(() => {
      RootStore.preference_store.set_sound_enabled(true);
    });
    renderComponentWithRootStore(<EnableSoundToggle />, RootStore);
    act(() => {
      fireEvent.click(screen.getByLabelText("toggle sound off"));
    });
    expect(RootStore.preference_store.sound_enabled).toBe(false);
    expect(SoundBridge.mock.instances[0].playMoveSoundEffect).not.toBeCalled();
  });

  it("toggles the sound ON from OFF and triggers a SFX", () => {
    act(() => {
      RootStore.preference_store.set_sound_enabled(false);
    });
    renderComponentWithRootStore(<EnableSoundToggle />, RootStore);
    act(() => {
      fireEvent.click(screen.getByLabelText("toggle sound on"));
    });
    expect(RootStore.preference_store.sound_enabled).toBe(true);
    expect(SoundBridge.mock.instances[0].playMoveSoundEffect).toBeCalledTimes(
      1
    );
  });
});
