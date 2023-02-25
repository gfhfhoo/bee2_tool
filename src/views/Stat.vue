<template>
  <div class="tools">
    <Transition name="opacity">
      <div class="tip" v-show="danmaku.length>0">
        有效计入 {{ count.number.toFixed(0) }} 条
      </div>
    </Transition>
    <div class="chart-wrapper" :style="{width: `${width}px`,height: `${height}px`}" v-show="!isEndVoting">
      <canvas v-show="isShow" id="chart" :width="width" :height="height"></canvas>
      <div v-show="!isShow" class="no_data"
           :style="{width: `${width}px`,height: `${height}px`}">
        <span>{{ tipBoardText }}</span>
      </div>
      <div class="legend">
        <marquee-text class="marquee" :repeat="5" :key="legend.toString()">
          <span>投票关键字：{{ KeysStr }}</span>
        </marquee-text>
      </div>
    </div>
    <div class="circle">
      <Countdown :radius="radius" :max="maxCountdownNum" :control="countDownControl" @onend="onEnd"/>
    </div>
    <Transition name="opacity">
      <div class="result" v-show="isEndVoting">
        <div>
          <p class="alarm">⏳</p>
          <span>投票结果</span>
        </div>
        <div class="content" v-if="danmaku.length>0">
          <p class="choice"><span class="percent">{{ mostOfVoteRatio.toFixed(2) }}%</span>的投票选择了...</p>
          <p class="key_item">{{ mostOfVoteKey }}</p>
        </div>
        <div class="content" v-else>
          <p class="choice">没有人参与本轮投票....</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import {Chart} from "chart.js/auto";
import {Colors} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {appWindow} from "@tauri-apps/api/window";
import {emit, listen} from "@tauri-apps/api/event";
import {msgToKey} from "../utils/util";
import {STAT_PAYLOAD} from "../api/types";
import gsap from "gsap";
import Countdown from "../components/tiny/Countdown.vue";
import MarqueeText from 'vue-marquee-text-component'

type K = {
  key: string,
  weight: number
}

const width = ref(300);
const height = ref(300);

let chart = null;
let ctx = null;

const voteMap = new Map<number, boolean>();

// reactive data
const danmaku = ref<K[]>([]);
const legend = ref([]);
const count = reactive({
  number: 0
});
const maxCountdownNum = ref(0);
const radius = ref(0);

const countDownControl = ref(false);
const isEndVoting = ref(false);

const mostOfVoteRatio = ref(0);
const mostOfVoteKey = ref("");

const tipBoardText = ref("等待投票开始");

onMounted(() => {

  // bind `windows close` event
  document.getElementById("window_close").addEventListener('click', () => {
    appWindow.close();
  })

  listen("stat_start", (e: any) => {
    tipBoardText.value = "等待弹幕"
    maxCountdownNum.value = e.payload.countdown;
    if (maxCountdownNum.value !== -1) {
      // 有倒计时
      startCountdown();
    } else {
      // 无倒计时
    }

    // 设置关键字滚动
    // document.querySelector(".legend span:nth-child(1)").setAttribute("rollup", '')
    //
    // setInterval(() => {
    //   const show = document.querySelector(".legend span[rollup]")
    //   const next = document.querySelector(".legend span[rolldown]") || document.querySelector(".legend span:first-child");
    //   const up = document.querySelector(".legend span[rollhide]")
    //
    //   if (up) {
    //     up.removeAttribute("rollhide");
    //     up.setAttribute("rolldown", '');
    //   }
    //
    //   show.removeAttribute("rollup")
    //   show.setAttribute("rollhide", '');
    //
    //   next.setAttribute("rollup", '')
    // }, 1000);

  })

  listen("stat_stop", () => {
    tail();
  })

  listen("stat_clear", () => {
    clear();
    tail();
  })

  listen("stat_legend", (e: any) => {
    setLabels(e.payload)
  })

  listen("stat_data", (e: any) => {
    const data: STAT_PAYLOAD = e.payload;
    const turnedKey = msgToKey(legend.value, data.msg);
    if (!voteMap.has(data.uid) && turnedKey !== '') {
      voteMap.set(data.uid, true);
      danmaku.value.push({
        key: turnedKey,
        weight: data.weight
      }); // 只有不在已投票名单的才计入
      emit("stat_update_voting", {data: data.uid});
      calAndSet();
    }
  })

  Chart.register([ChartDataLabels, Colors]);
  ctx = document.getElementById("chart");
  init();
})

function startCountdown() {
  // 回收状态
  // opacity.value = 1;
  backward();
  countDownControl.value = true;
  isEndVoting.value = false;
}

async function onEnd() {
  countDownControl.value = false;
  isEndVoting.value = true;
  await emit("stat_timeUp", {});
}

function tail() {
  countDownControl.value = false;
  isEndVoting.value = true
  tipBoardText.value = "等待投票开始";
  // opacity.value = 0;
  expand();
}

function expand() {
  radius.value = 946;
}

function backward() {
  radius.value = 200;
}

function init() {
  if (chart) {
    chart.destroy();
    chart = null;
  }

  chart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'pie',
    data: {
      datasets: [
        {
          data: [2, 3]
        }
      ],
      labels: ["hello", "world"]
    },
    options: {
      responsive: true,
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 50,
          bottom: 50
        }
      },
      plugins: {
        colors: {
          forceOverride: true
        },
        datalabels: {
          color: 'white',
          font: {
            size: 15
          },
          formatter: (v, ctx) => {
            if (v === 0) return "";
            let datasets = ctx.chart.data.datasets;
            if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
              let sum: any = datasets[0].data.reduce((a: any, b: any) => a + b, 0);
              return Math.fround((v / sum) * 100).toFixed(2) + '%';
            }
            return ""
          }
        },
        legend: {
          position: "left",
          labels: {
            boxWidth: 20,
            boxHeight: 20,
            font: {
              size: 13,
            }
          },
        }
      },
    }
  });
}

function clear() {
  legend.value = [];
  danmaku.value = [];
  voteMap.clear();
  init();
}

function setLabels(labels) {
  legend.value = labels;
  chart.data.labels = labels;
  chart.update();
}

function setData(data) {
  chart.data.datasets[0].data = data;
  chart.update();
}

function calAndSet() {
  if (legend.value.length > 0) {
    let isEffected = false;
    let data = new Array(legend.value.length).fill(0);
    for (let i = 0; i < legend.value.length; ++i) {
      for (let j = 0; j < danmaku.value.length; ++j) {
        if (danmaku.value[j].key === legend.value[i]) {
          data[i] += danmaku.value[j].weight;
          isEffected = true;
        }
      }
    }
    if (isEffected) {
      let idx = data.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
      let acc = data.reduce((p, c) => p + c, 0);
      mostOfVoteKey.value = legend.value[idx];
      mostOfVoteRatio.value = data[idx] * 100 / acc;
      setData(data);
    }
  }
}

const isShow = computed(() => {
  return legend.value.length > 0 && danmaku.value.length > 0
})

watch(danmaku, (now) => {
  gsap.to(count, {duration: 0.5, number: Number(now.length) || 0});
}, {deep: true})

const KeysStr = computed(() => {
  let str = '';
  for (let value of legend.value.values()) {
    str += `[${value}] `
  }
  return str
})

</script>

<style scoped lang="scss">
.trans-opacity {
  transition: opacity .4s ease-out;
}

#chart {
  position: absolute;
  z-index: 9999;
  user-select: none;
}

.tools {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  //background: #0e1116;
}

.chart-wrapper {
  position: relative;
  z-index: 99989;
}

.tip {
  position: absolute;
  width: 300px;
  text-align: center;
  font-size: .8rem;
  font-weight: bold;
  z-index: 10000;
  top: 4%;
  user-select: none;
}

.no_data {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 2rem;
  color: rgba(111, 111, 111, 0.8);
  z-index: 1;
}

.circle {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 99989;
}

.result {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  z-index: 99999;

  .alarm {
    font-size: 4rem;
    margin-top: 20px;
  }

  span, p {
    font-family: "PingFang SC", Helvetica, sans-serif;
    font-size: 2rem;
    font-weight: bold;
    color: white;
  }

  .key_item {
    font-size: 2.5rem;
  }

  .content {
    margin-top: 10px;
  }

  .choice {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .percent {
    font-size: 1rem;
    color: #1fe797;
    margin-right: 5px;
  }
}

.legend {
  position: absolute;
  width: 100%;
  bottom: 0;
  user-select: none;
  z-index: 99989;

  .marquee {
    width: 100%;
  }

  span {
    font-size: .9rem;
    font-weight: bold;
    padding-right: 20px;
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
