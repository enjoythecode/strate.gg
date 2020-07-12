<template>
  <div class="playOffline">
    <h1>Play (Offline)</h1>
    <GameSettingSelector />
  </div>
</template>

<script>
// @ is an alias to /src
import GameSettingSelector from "@/components/GameSettingSelector.vue";

export default {
  name: "PlayOffline",
  components: {
    GameSettingSelector
  }
};
</script>
