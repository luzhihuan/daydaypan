<template>
  <div class="music">
    <div class="body-content">
      <div class="cover">
        <img src="@/assets/music_cover.png">
      </div>
      <div ref="playerRef" class="music-player"></div>
    </div>
  </div>
</template>

<script setup>
import {ref, getCurrentInstance, onMounted, onUnmounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import APlayer from "APlayer";
import 'APlayer/dist/APlayer.min.css'

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})

const props = defineProps({
  url: {
    type: String
  },
  fileName: {
    type: String
  }
})

const playerRef = ref()
const player = ref()
onMounted(() => {
  player.value = new APlayer({
    container: playerRef.value,
    audio: {
      url: `/api/${props.url}`,
      name: props.fileName,
      cover: new URL('@/assets/music_icon.png', import.meta.url).href,
      artist: ''
    }
  })
})

onUnmounted(() => {
  player.value.destroy()
})
</script>

<style scoped lang="scss">
.music{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  .body-content{
    text-align: center;
    width: 80%;
    .cover{
      margin: 0 auto;
      width: 200px;
      text-align: center;
      img{
        width: 100%;
      }
    }
    .music-player{
      margin-top: 20px;
    }
  }
}
</style>