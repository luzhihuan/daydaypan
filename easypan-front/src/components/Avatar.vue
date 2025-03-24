<template>
  <div class="avatar-wrapper">
    <img
        :src="avatar || `/api/${proxy.globalInfo.avatarUrl}${userId}?${timestamp}`"
        class="user-avatar"
        :style="{ width: width + 'px', height: width + 'px' }"
    >
    <!-- 仅VIP显示皇冠 -->
    <i
        v-if="role === 1"
        class="fas fa-crown vip-crown"
    ></i>
  </div>
</template>
<script setup>
import {ref, reactive, getCurrentInstance, nextTick} from 'vue'

const {proxy} = getCurrentInstance()

const props = defineProps({
  userId: {
    type: String
  },
  width: {
    type: Number,
    default: 40
  },
  avatar: {
    type: String
  },
  timestamp: {
    type: Number,
    default: 0
  },
  role: {
    type: Number,
    default: 0
  }
})

</script>

<style lang="scss" scoped>
.avatar-wrapper {
  position: relative;
  display: inline-block;

  .user-avatar {
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #eee;
  }
}
</style>
