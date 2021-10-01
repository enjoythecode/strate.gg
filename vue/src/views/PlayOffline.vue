<template>
  <div class="playOffline">
    <h1>Play (Offline)</h1>
    <!--<GameSettingSelector />-->
    <div 
    id="setting-selector"
    v-if="!isGameInPlay"
    >
      <p>Settings Selector</p>
      <button v-on:click="start_game(4,0)">4x4, config 1</button>
      <button v-on:click="start_game(6,0)">6x6, config 1</button>
      <button v-on:click="start_game(10,0)">10x10, config 1</button>
    </div>
    <AmazonsBoard
      ref = "board"
      v-if = "isGameInPlay"
    />
  </div>
</template>

<script>
// @ is an alias to /src
//import GameSettingSelector from "@/components/GameSettingSelector.vue";
import AmazonsBoard from "@/components/AmazonsBoard.vue";

export default {
  name: "PlayOffline",
  data: function () {
    return {
      isGameInPlay: false
    }
  },
  components: {
    AmazonsBoard
    //GameSettingSelector
  },
  methods: {
    start_game: function (/*board_size, config_no*/){
      this.$emit("test")
      console.log("emitted")
      //this.$refs.board.init_board(board_size, config_no)
      //this.isGameInPlay = true
    }
  }
};
</script>
