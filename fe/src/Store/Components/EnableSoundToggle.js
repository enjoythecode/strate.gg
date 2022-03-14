import { observer } from "mobx-react";
import { useRootStore } from "../RootStore";

export const EnableSoundToggle = observer(() => {
  const preference_store = useRootStore().preference_store;
  let sound_is_enabled = preference_store.sound_enabled;
  return (
    <button onClick={preference_store.toggle_sound_enabled}>
      Sound {sound_is_enabled ? "ON" : "OFF"}
    </button>
  );
});
