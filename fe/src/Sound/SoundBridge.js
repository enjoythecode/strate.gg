import { Howl } from "howler";

export class SoundBridge {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  playMoveSoundEffect() {
    if (this.playingSoundIsEnabled()) {
      const sfxPlayMove = new Howl({
        src: ["pop.mp3"],
      });
      sfxPlayMove.play();
    }
  }

  playingSoundIsEnabled() {
    return this.rootStore.preference_store.sound_enabled;
  }
}
