<template>
  <div>
    <div class="round" :style="{width: `${radius}px`,height: `${radius}px`}"></div>
    <Transition name="opacity">
      <span class="text" v-show="control">{{ _now }}</span>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps(['max', "control", 'radius']);
const emit = defineEmits(["onchange", "onend"])

const _now = ref(props.max);

let timer = null;

function clear() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function set() {
  _now.value = props.max;
  timer = setInterval(() => {
    _now.value--;
  }, 1000);
}

watch(_now, (val: number) => {
  if (val !== 0) {
    emit("onchange", val);
  } else {
    clear();
    emit("onend", null);
  }
})

watch(() => props.control, (val) => {
  clear();
  if (val) set();
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

.text {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 70px;
  width: 70px;
  left: 5px;
  top: 5px;
  font-size: 50px;
  text-align: center;
  color: white;
  font-weight: bold;
  font-family: Helvetica, sans-serif;
  z-index: 99999;
}

@keyframes rotate {
  100% {
    transform-origin: center;
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.opacity-enter-active,
.opacity-leave-active {
  transition: opacity .4s ease-in-out;
}

.opacity-enter-from,
.opacity-leave-to {
  opacity: 0;
}
</style>
