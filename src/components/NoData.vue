<template>
  <div class="no-data">
    <div>
      <Icon iconName="no_data" :width="120" fit="fill"></Icon>
    </div>
    <div class="msg">{{ msg }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  msg: {
    type: String
  }
})
</script>

<style scoped lang="scss">
.no-data {
  text-align: center;
  padding: 10px 0;

  .icon-empty {
    font-size: 50px;
    color: #ddd;
  }

  .msg {
    margin-top: 10px;
    color: #999999;
    font-size: 14px;
  }
}
</style>