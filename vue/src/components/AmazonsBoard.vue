<template>
  <div class="board">
    Board goes here.
  </div>
</template>

<script>
export default {
  name: "AmazonsBoard",
  props: {
  },
  methods: {
    init_board: function (board_size, config_no){
      console.log("init board!", board_size, config_no)
    }
  },
  mounted() {
    this.$on('test', () => {
      console.log("heard!")
    });
  },
};
</script>

<style scoped lang="scss">
</style>
