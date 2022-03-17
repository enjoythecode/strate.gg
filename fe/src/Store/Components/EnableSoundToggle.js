import { observer } from "mobx-react";
import { useRootStore } from "../RootStore";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

export default observer(function EnableSoundToggle() {
  const preference_store = useRootStore().preference_store;
  let sound_is_enabled = preference_store.sound_enabled;
  return (
    <IconButton onClick={preference_store.toggle_sound_enabled}>
      {sound_is_enabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
    </IconButton>
  );
});
