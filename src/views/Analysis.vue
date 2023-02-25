<template>
  <div class="analysis">
    <div class="outline">
      <div class="item">
        <p>观众人数</p>
        <span>{{ store.attendance }}</span>
      </div>
      <div class="item">
        <p>累计投票弹幕</p>
        <span>{{ store.votingDanmaku }}</span>
      </div>
      <div class="item">
        <p>本场累计礼物电池</p>
        <span>{{ store.giftValues }}</span>
      </div>
    </div>
    <div class="detail">
      <div class="item">
        <p>发言率</p>
        <span>{{ store.speechRate.toFixed(1) }}%</span>
      </div>
      <div class="item">
        <p>平均发言次数</p>
        <span>{{ store.avgSpeechTimes }}</span>
      </div>
      <div class="item">
        <p>有效平均停留时长</p>
        <span>{{ store.avgEffStay }}</span>
      </div>
      <div class="item">
        <p>参票率</p>
        <span>{{ store.attendVotingRatio.toFixed(1) }}%</span>
      </div>
    </div>
    <canvas id="trendy" width="450" height="200"></canvas>
  </div>
</template>

<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import {Chart} from "chart.js/auto";
import 'chartjs-adapter-moment';
import {useStatStore} from "../store/stat";
import {calZScore} from "../utils/util";

const store = useStatStore();

const timeSeries = ref(new Set<number>());

const _l1 = [];
const _l2 = [];
const _l3 = [];

let chart = null;

onMounted(() => {
  const ctx = document.getElementById("trendy");
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: "发言分数",
        data: [],
        tension: 0.2
      }, {
        label: "停留时长分数",
        data: [],
        tension: 0.2
      }, {
        label: "参票分数",
        data: [],
        tension: 0.2
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          display: false
        }
      }
    }
  })
})

watch([
  () => store.speechRate,
  () => store._avgEffStay,
  () => store._votingRatio
], ([v1, v2, v3]) => {

  let bool1 = _l1.length % 10 === 0;
  let bool2 = _l2.length % 10 === 0;
  let bool3 = _l3.length % 10 === 0;

  if (bool1 || bool2 || bool3) {
    const date = new Date().getTime();
    timeSeries.value.add(date);
    chart.data.labels = [...timeSeries.value];
  }

  if (bool1 && _l1.length > 0) chart.data.datasets[0].data.push(calZScore(_l1, v1));
  if (bool2 && _l2.length > 0) chart.data.datasets[1].data.push(calZScore(_l2, v2));
  if (bool3 && _l3.length > 0) chart.data.datasets[2].data.push(calZScore(_l3, v3));

  if(chart.data.datasets[0].data.length>75) chart.data.datasets[0].data = chart.data.datasets[0].data.slice(-75);
  if(chart.data.datasets[1].data.length>75) chart.data.datasets[1].data = chart.data.datasets[1].data.slice(-75);
  if(chart.data.datasets[2].data.length>75) chart.data.datasets[2].data = chart.data.datasets[2].data.slice(-75);

  _l1.push(v1);
  _l2.push(v2);
  _l3.push(v3);

  chart.update();
})

</script>

<style scoped lang="scss">
.analysis {
  width: 100%;
  padding: 8px 20px;
  box-sizing: border-box;
}

.outline {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33%;

    p {
      margin-bottom: 5px;
    }

    span {
      font-weight: bold;
      font-size: 2rem;
      font-family: Helvetica, sans-serif;
    }
  }
}

.detail {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 10px;

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin: 5px 0;

    p {
      display: flex;
      align-items: center;
    }

    p::after {
      content: '';
      display: inline-block;
      width: 20px;
      margin: 0 5px;
      border: 1px solid grey;
    }

    span {
      font-weight: bold;
      font-family: Helvetica, sans-serif;
    }
  }
}

#trendy {
  margin-top: 10px;
}
</style>
