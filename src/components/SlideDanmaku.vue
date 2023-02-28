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
import FireIconUrl from "../assets/87513-fire-4_1.gif"

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

function rankingEmit(msg) {
  danmaku.emit({
    render(): HTMLElement {
      let div = document.createElement("div");
      let img = document.createElement("img");
      let span = document.createElement("span");
      img.src = FireIconUrl;
      span.innerText = msg;
      div.setAttribute("class", "danmaku-basic-override danmaku-ranking");
      img.setAttribute("class", "danmaku-fire");
      div.appendChild(img);
      div.appendChild(span);
      return div;
    }
  })
}

function emit(obj) {
  switch (obj.property) {
    case UserProperty.NormalUser:
      // rankingEmit(obj.msg);
      basicEmit(obj.msg);
      break;
    case UserProperty.Giver:
      giverEmit(obj.msg);
      break;
    case UserProperty.Captain:
      captainEmit(obj.msg)
      break;
    case UserProperty.RankingUser:
      rankingEmit(obj.msg);
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
  line-height: 18px;
}

.danmaku-basic {
  position: relative;
  color: white;
  margin-top: 3px;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 1px 0 1px #000, 0 1px 1px #000, 0 -1px 1px #000, -1px 0 1px #000;
}

.danmaku-colorful {
  color: #de3f3f !important;
}

.danmaku-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.danmaku-fire {
  position: absolute;
  width: 35px;
  height: 35px;
  margin-right: 5px;
  left: -8px;
  top: -1px;
}

.danmaku-basic-override {
  position: relative;
  color: white;
  margin-top: 3px;
  font-size: 18px;
  font-weight: bold;
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

.danmaku-ranking {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  //border: 1px solid red;
  padding: 5px 5px 5px 20px;
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
