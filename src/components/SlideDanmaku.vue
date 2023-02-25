<template>
  <div id="danmaku_window">
    <div id="danmaku_wrapper"></div>
  </div>
</template>

<script setup lang="ts">
import Danmaku from "danmaku";
import {onMounted} from "vue";
import {UserProperty} from "../api/types";
import CaptainIconUrl from "../assets/icon-l-3.402ac8f.png"

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
      let img = document.createElement("img");
      let span = document.createElement("span");
      img.src = CaptainIconUrl;
      span.innerText = msg;
      div.setAttribute("class", "danmaku-basic-override danmaku-captain");
      img.setAttribute("class", "danmaku-icon");
      div.appendChild(img);
      div.appendChild(span);
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
  color: #de3f3f !important;
}

.danmaku-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.danmaku-basic-override {
  position: relative;
  color: white;
  margin-top: 3px;
  font-size: 20px;
}

.danmaku-captain {
  position: relative;
  display: flex;
  align-items: center;
  padding: 5px 10px 5px 10px;
  box-sizing: border-box;
  background: linear-gradient(90deg,
      rgba(240, 163, 93, 1) 0%,
      rgba(91, 144, 132, 1) 20%,
      rgba(112, 119, 144, 1) 40%,
      rgba(112, 98, 184, 1) 60%,
      rgba(171, 85, 116, 1) 80%,
      rgba(240, 163, 93, 1) 100%
  );
  background-size: 200%;
  border-radius: 8px;
  animation: rainbow 2s linear infinite;
}

@keyframes rainbow {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: -100% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
