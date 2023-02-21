<template>
  <div class="round" :style="{width: `${radius}px`,height: `${radius}px`}"></div>
</template>

<script setup lang="ts">
import {reactive} from "vue";

const props = defineProps(['max', 'now', 'radius']);

const _now = reactive({
  number: props.max
})

</script>

<style scoped lang="scss">
.round {
  border-radius: 50%;
  background-color: #4158D0;
  background-image: linear-gradient(90deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
  transform: translate(-50%, -50%);
  transition: all .4s ease-in-out;
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  100% {
    transform-origin: center;
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
