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
    <div id="trendy"></div>
  </div>
</template>

<script setup lang="ts">

import {onMounted, watch} from "vue";
import ApexCharts from 'apexcharts'
import {useStatStore} from "../store/stat";
import {calZScore} from "../utils/util";
import moment from "moment";

const store = useStatStore();

let _l1 = [];
let _l2 = [];
let _l1_score = [];
let _l2_score = [];

let chart = null;

onMounted(() => {
  const ctx: any = document.getElementById("trendy");
  chart = new ApexCharts(ctx, {
    chart: {
      type: "line",
      width: "100%",
      height: 190,
      toolbar: {
        show: false,
      },
    },
    legend: {
      position: 'top',
      show: true
    },
    series: [],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    markers: {
      size: 5,
    },
    xaxis: {
      labels: {
        show: false,
        formatter: function (v) {
          return moment(v).format("YYYY-MM-DD HH:mm:ss")
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (v) {
          return v === 0 ? '0' : v.toFixed(2)
        }
      }
    },
  });
  chart.render();
  // chart = new Chart(ctx, {
  //   type: 'line',
  //   data: {
  //     labels: [],
  //     datasets: [{
  //       label: "发言分数",
  //       data: [],
  //       tension: 0.2
  //     }, {
  //       label: "停留时长分数",
  //       data: [],
  //       tension: 0.2
  //     }]
  //   },
  //   options: {
  //     scales: {
  //       x: {
  //         type: 'time',
  //         display: false
  //       }
  //     }
  //   }
  // })
})

watch([
  () => store.speechRate,
  () => store._avgEffStay,
], ([v1, v2]) => {

  const date = new Date().getTime();

  let bool1 = _l1.length % 10 === 0;
  let bool2 = _l2.length % 10 === 0;

  if (bool1 && _l1.length > 0) _l1_score.push([date, calZScore(_l1, v1)]);
  if (bool2 && _l2.length > 0) _l2_score.push([date, calZScore(_l2, v2)]);

  let len1 = _l1_score.length;
  let len2 = _l2_score.length;

  if (len1 > 45) _l1_score = _l1_score.slice(-45);
  if (len2 > 45) _l2_score = _l2_score.slice(-45);

  if (bool1 || bool2) {
    chart.updateSeries([{
      name: "发言分数",
      data: _l1_score
    }, {
      name: "停留时长分数",
      data: _l2_score
    }]);
  }

  _l1.push(v1);
  _l2.push(v2);
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
