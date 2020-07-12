<template>
  <div class="hello">
    <p>Settings Selector</p>
        <button @click="start_game(4,0)">4x4, config 1</button>
        <button @click="start_game(6,0)">6x6, config 1</button>
        <button @click="start_game(10,0)">10x10, config 1</button>
  </div>
</template>

<script>
export default {
  name: "GameSettingSelector",
  props: {
  }
};
</script>

<style scoped lang="scss">
h1 {
  margin: 40px 0 0;
}
</style>
