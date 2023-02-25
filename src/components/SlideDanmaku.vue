<template>
  <div id="danmaku_window">
    <div id="danmaku_wrapper"></div>
  </div>
</template>

<script setup lang="ts">
import Danmaku from "danmaku";
import {createApp, defineComponent, onMounted} from "vue";
import CaptainDanmaku from "./tiny/CaptainDanmaku.vue";
import {UserProperty} from "../api/types";

const captainEl = defineComponent({
  extends: CaptainDanmaku
})

let danmaku: Danmaku;

onMounted(() => {
  danmaku = new Danmaku({
    container: document.getElementById("danmaku_wrapper"),
    engine: "dom"
  })
});

function captainEmit(msg) {
  danmaku.emit({
    render(): HTMLElement {
      let div = document.createElement("div");
      createApp(captainEl, {
        msg: msg
      }).mount(div)
      return div;
    }
  })
}

function giverEmit(msg) {
  danmaku.emit({
    render(): HTMLElement {
      let div = document.createElement("div");
      div.innerText = msg;
      div.setAttribute("class", "danmaku-basic danmaku-colorful");
      return div;
    }
  })
}

function basicEmit(msg) {
  danmaku.emit({
    render(): HTMLElement {
      let div = document.createElement("div");
      div.innerText = msg;
      div.setAttribute("class", "danmaku-basic");
      return div;
    }
  })
}

function emit(obj) {
  switch (obj.property) {
    case UserProperty.NormalUser:
      basicEmit(obj.msg);
      break;
    case UserProperty.Giver:
      giverEmit(obj.msg);
      break;
    case UserProperty.Captain:
      captainEmit(obj.msg)
      break;
  }
}

defineExpose({
  emit
});


</script>

<style lang="scss">
#danmaku_window {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 320px;
}

#danmaku_window, #danmaku_wrapper {
  background: #1231cd;
  //background: #000000;
  user-select: none;
}

#danmaku_wrapper {
  width: 95%;
  height: 95%;
  line-height: 15px;
}

.danmaku-basic {
  position: relative;
  color: white;
  margin-top: 3px;
  font-size: 20px;
  font-weight: bold;
  -webkit-text-stroke: 1px black;
}

.danmaku-colorful {
  color: #c93939 !important;
}
</style>
