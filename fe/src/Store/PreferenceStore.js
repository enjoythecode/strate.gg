import { makeObservable, observable, action } from "mobx";

export default class PreferenceStore {
  sound_enabled = true;

  constructor() {
    makeObservable(this, {
      sound_enabled: observable,
      set_sound_enabled: action,
      toggle_sound_enabled: action,
    });
  }

  set_sound_enabled = (enabled) => {
    this.sound_enabled = enabled;
  };

  toggle_sound_enabled = () => {
    this.sound_enabled = !this.sound_enabled;
  };
}
