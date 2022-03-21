import { Howl } from "howler";
import { initRootStoreAndSocket } from "Store/RootStore";

jest.mock("howler");

beforeEach(() => {
  Howl.mockClear();
});

it("does not play a sound if sound is muted site-wide", () => {
  const RootStore = initRootStoreAndSocket();

  RootStore.preference_store.set_sound_enabled(false);
  RootStore.sound_bridge.playMoveSoundEffect();

  expect(Howl).not.toHaveBeenCalled();
});
