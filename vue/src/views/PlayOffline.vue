<template>
  <div class="playOffline">
    <h1>Play (Offline)</h1>
    <GameSettingSelector />
    <p>Settings Selector</p>
    <button @click="start_game(4,0)">4x4, config 1</button>
    <button @click="start_game(6,0)">6x6, config 1</button>
    <button @click="start_game(10,0)">10x10, config 1</button>
  </div>
</template>

<script>
// @ is an alias to /src
//import GameSettingSelector from "@/components/GameSettingSelector.vue";

export default {
  name: "PlayOffline",
  components: {
    //GameSettingSelector
  }
};
</script>
