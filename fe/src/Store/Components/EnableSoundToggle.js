import { observer } from "mobx-react";
import { useRootStore } from "Store/RootStore";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

export default observer(function EnableSoundToggle() {
  const RootStore = useRootStore();
  const preference_store = RootStore.preference_store;
  const SoundBridge = RootStore.sound_bridge;

  function handleSoundToggleClick() {
    preference_store.toggle_sound_enabled();
    if (preference_store.sound_enabled) {
      SoundBridge.playMoveSoundEffect();
    }
  }
  return (
    <IconButton onClick={handleSoundToggleClick}>
      {preference_store.sound_enabled ? (
        <VolumeUpIcon aria-label="toggle sound off" color="success" />
      ) : (
        <VolumeOffIcon aria-label="toggle sound on" />
      )}
    </IconButton>
  );
});
