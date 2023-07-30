<template>
  <SlideDanmaku ref="danmakuRef"/>
  <div class="container">
    <div class="menu">
      <div class="item" :class="{item_clicked: currentTab==='MainPage'}" @click="switchPage('MainPage')">
        <svg class="svg_icon" viewBox="0 0 1024 1024">
          <path
              d="M943.698093 792.31222 574.317301 422.932452c36.332487-92.849688 16.147772-203.865107-58.535161-278.549064-80.738859-80.738859-201.847148-96.886631-298.733778-50.461275l175.606507 175.606507L269.52862 392.655891 93.922113 217.048361c-46.424332 96.886631-30.27656 217.994919 50.461275 298.733778 74.682933 74.682933 185.699376 94.867648 278.549064 58.535161l369.379769 369.379769c16.147772 16.147772 42.387389 16.147772 56.517201 0l94.867648-94.867648C959.845865 834.700633 959.845865 808.459992 943.698093 792.31222z">
          </path>
        </svg>
        主配置
      </div>
      <div class="item" :class="{item_clicked: currentTab==='VoteCountingSettings'}"
           @click="switchPage('VoteCountingSettings')">
        <svg class="svg_icon" viewBox="0 0 1024 1024">
          <path
              d="M848.794624 939.156685 571.780416 939.156685 571.780416 653.17123l341.897539 0 0 221.100654C913.677926 909.960704 884.482867 939.156685 848.794624 939.156685zM571.780403 318.743552c-11.861606-3.210138-31.443354-8.36864-39.829709-16.176435-0.596582-0.561766-1.016218-1.246413-1.613824-1.841971-0.560845 0.596582-1.016218 1.280205-1.613824 1.841971-8.386355 7.807795-15.96631 12.965274-27.827917 16.176435l0 263.544325L141.030675 582.287877 141.030675 355.202884c0-35.687834 29.195059-64.882688 64.883302-64.882688l150.649125 0c-16.984474-9.525965-32.846438-20.56233-46.111027-32.932045-60.250624-56.144691-71.129907-137.062605-24.283034-180.767027 19.615539-18.264986 46.252237-27.124736 75.026739-27.124736 39.933133 0 83.972915 17.070797 118.995968 49.706086 20.353331 18.983322 37.722624 43.405619 50.145075 69.056819 12.457267-25.6512 29.791744-50.074419 50.180915-69.056819 35.022029-32.63529 79.062835-49.706086 118.994944-49.706086 28.74071 0 55.410176 8.860774 75.025715 27.124736 46.882611 43.704422 35.96759 124.622336-24.283034 180.767027-13.264589 12.368691-29.127578 23.40608-46.111027 32.932045l144.649234 0c35.688243 0 64.882278 29.195981 64.882278 64.882688l0 227.084948L571.780416 582.287833 571.780416 318.743508zM435.064218 147.625267c-21.476966-19.965747-49.094144-31.913882-73.868288-31.913882-7.404954 0-21.125018 1.211597-29.863322 9.386803-2.000691 1.824563-8.070144 7.439462-8.070144 21.369754 0 15.650406 8.492749 40.24873 32.319386 62.477926 29.124506 27.12576 77.202432 47.601152 111.76704 47.601152 12.176794 0 16.492237-2.666701 16.527053-2.702541C489.524736 242.54505 475.664486 185.453773 435.064218 147.625267zM577.78135 254.790963c0 0 0.034816-0.034816 0.069632-0.034816 0.807424 0 5.50871 1.790771 15.509914 1.790771 34.564608 0 82.64151-20.47529 111.76704-47.601152 23.826637-22.229299 32.283546-46.810112 32.283546-62.442189 0-13.930291-6.033613-19.562496-8.035328-21.404467-8.77312-8.17623-22.457344-9.386803-29.864346-9.386803-24.808038 0-52.390298 11.948134-73.867264 31.913882C585.325466 185.208218 571.358822 241.73865 577.78135 254.790963zM500.89513 939.156685 205.914017 939.156685c-35.688243 0-64.883302-29.195981-64.883302-64.883712L141.030714 653.17123l359.864462 0L500.895177 939.15666z">
          </path>
        </svg>
        特殊弹幕配置
      </div>
      <div class="item" :class="{item_clicked: currentTab==='Analysis'}"
           @click="switchPage('Analysis')">
        <svg class="svg_icon" viewBox="0 0 985 985">
          <path
              d="M163.7 749.9c-63.9 0-115.9-52-115.9-116s52-116 115.9-116c63.9 0 116 52 116 116s-52.1 116-116 116z m0-161.9c-25.4 0-46 20.6-46 46s20.6 46 46 46 46-20.6 46-46-20.6-46-46-46zM393.1 538.7c-63.9 0-116-52-116-116 0-63.9 52-115.9 116-115.9 63.9 0 115.9 52 115.9 115.9 0.1 63.9-51.9 116-115.9 116z m0-162c-25.4 0-46 20.6-46 46s20.6 46 46 46 46-20.6 46-46c0-25.3-20.6-46-46-46zM859.9 504.4c-63.9 0-115.9-52-115.9-115.9 0-63.9 52-116 115.9-116 63.9 0 116 52 116 116 0 63.9-52 115.9-116 115.9z m0-161.9c-25.4 0-46 20.6-46 46s20.6 46 46 46 46-20.6 46-46-20.6-46-46-46z"
          ></path>
          <path
              d="M220.9 611.7c-8.9 0-17.9-3.4-24.7-10.2-13.7-13.7-13.7-35.8 0-49.5l106.6-106.6c13.7-13.7 35.8-13.7 49.5 0 13.7 13.7 13.7 35.8 0 49.5L245.7 601.4c-6.9 6.9-15.8 10.3-24.8 10.3zM552.7 580c-8.9 0-17.9-3.4-24.7-10.2L441.2 483c-13.7-13.7-13.7-35.8 0-49.5 13.6-13.7 35.8-13.7 49.5 0l86.8 86.8c13.7 13.7 13.7 35.8 0 49.5-6.9 6.7-15.8 10.2-24.8 10.2zM691 592.4c-8.9 0-17.9-3.4-24.7-10.2-13.7-13.7-13.7-35.8 0-49.5L778 421c13.6-13.7 35.8-13.7 49.5 0 13.7 13.7 13.7 35.8 0 49.5L715.7 582.1c-6.8 6.9-15.8 10.3-24.7 10.3z"
          ></path>
          <path
              d="M620.1 714.8c-63.9 0-116-52-116-116s52-116 116-116c63.9 0 115.9 52 115.9 116s-52 116-115.9 116z m0-162c-25.4 0-46 20.6-46 46s20.6 46 46 46 46-20.6 46-46c0-25.3-20.6-46-46-46z"
          ></path>
        </svg>
        参与度分析
      </div>
<!--      <div class="item" :class="{item_clicked: currentTab==='config'}" @click="switchPage('Config')">-->
<!--        <svg class="svg_icon" viewBox="0 0 1024 1024">-->
<!--          <path-->
<!--              d="M512 1024L68.338225 767.821104V256.178896L512 0l443.661775 256.178896v511.642208zM211.454927 685.529001L512 858.70021l300.545073-173.171209V338.470999L512 165.29979 211.454927 338.470999z"-->
<!--          ></path>-->
<!--          <path-->
<!--              d="M512 511.642208m-143.116702 0a143.116702 143.116702 0 1 0 286.233404 0 143.116702 143.116702 0 1 0-286.233404 0Z"-->
<!--          ></path>-->
<!--        </svg>-->
<!--        更多配置-->
<!--      </div>-->
      <div class="item" :class="{item_clicked: currentTab==='About'}"
           @click="switchPage('About')">
        <svg class="svg_icon" viewBox="0 0 1024 1024">
          <path
              d="M512 64c247.424 0 448 200.576 448 448s-200.576 448-448 448S64 759.424 64 512 264.576 64 512 64z m0 85.333333C311.701333 149.333333 149.333333 311.701333 149.333333 512s162.368 362.666667 362.666667 362.666667 362.666667-162.368 362.666667-362.666667S712.298667 149.333333 512 149.333333z m21.333333 277.333334a21.333333 21.333333 0 0 1 21.333334 21.333333v298.666667a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333V448a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666z m0-170.666667a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666z"
          ></path>
        </svg>
        关于
      </div>
    </div>
    <div class="view">
      <!--      <span class="test" v-if="currentTab==='MainPage'">弹幕密集度: {{ speed.toFixed(4) }}</span>-->
      <KeepAlive>
        <component :is="tab[currentTab]" @requestConnect="connect"></component>
      </KeepAlive>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {BilibiliWebsocket} from "../api/bilibili_websocket";
import {SlideWindow} from "../utils/slide_window";
import {appWindow} from "@tauri-apps/api/window";
import {emit, listen} from "@tauri-apps/api/event";
import {
  isCaptainByDanmaku,
  msgToKey,
} from "../utils/util";
import {emitter} from "../api/emitter";
import SlideDanmaku from "../components/SlideDanmaku.vue";
import {INFO_DANMU, INFO_GIFT} from "../api/types";
import {UserManager} from "../utils/user_manager";

import MainPage from "./MainPage.vue";
import VoteCountingSettings from "./VoteCountingSettings.vue";
import {useConfigStore} from "../store/config";
import About from "./About.vue";
import Analysis from "./Analysis.vue";
import Config from "./Config.vue";
import {useStatStore} from "../store/stat";
import {invoke} from "@tauri-apps/api";


import protoUrl from "../assets/model.proto?url"


const tab = {
  MainPage,
  VoteCountingSettings,
  Analysis,
  About,
  Config
}

const currentTab = ref("MainPage");

const danmakuRef = ref<InstanceType<typeof SlideDanmaku> | null>(null);

const store = useConfigStore();
const statStore = useStatStore();

const slides = new SlideWindow(15);

let instance: BilibiliWebsocket;
let userManager: UserManager;

// config

const speed = ref(0);

onMounted(() => {

  // when document load
  window.addEventListener("load", () => {
    appWindow.setTitle("觅2直播间弹幕工具")
  })

  // init filters

  store.setFilter();
  store.setFilterStatus();

  // pitchfork
  setInterval(() => {
    checkConnection()
  }, 5000);


  listen("stat_update_voting", (e: any) => {
    statStore.incAccVotingDanmaku();
    userManager.incVotingTime(e.payload.data);
  })

  // internal emitter

  emitter.on("INTER_GET_VOTING_MAP",(e:any)=>{
    statStore.internal_voting_map = userManager.getVotingMap();
  })

  // danmaku msg incoming

  emitter.on("APP_DANMU", (e: any) => {
    onDanmakuComing(e.data)
  });

  emitter.on("APP_GIFT_RECEIVED", (e: any) => onGiftReceived(e.data));

  emitter.on("APP_ROOM_ID_UPDATE", (e: any) => {
    store.roomId = e.data;
    userManager = new UserManager(store.roomId, store, statStore);
  })

  emitter.on("APP_ONLINE_COUNT", (e: any) => {
    if (statStore.maxOnline !== 0) {
      let diff = statStore.online - e.data;
      if (diff > 0) statStore.maxOnline += diff;
      else statStore.maxOnline -= diff;
    } else {
      statStore.maxOnline = e.data;
    }
    statStore.online = e.data;
  })

  emitter.on("APP_ONLINE_RANK", (e: any) => {

  })
})

function switchPage(page) {
  currentTab.value = page;
}

async function onDanmakuComing(data: INFO_DANMU) {

  // 更新用户信息
  if (isCaptainByDanmaku(store.roomId, data)) userManager.addCaptain(data.uid); // 舰长判断

  // 检测：是否存在发言间隔、是否刷屏
  if (await decide(data)) {
    // 看一下是不是投票弹幕
    let nullKey = msgToKey(store.keys, data.msg) === '';

    // 设定该用户本次发言时间的数据
    userManager.updateSpeechTimestamp(data.uid, data.timestamp);
    // 更新该用户发言次数
    userManager.incSpeechTime(data.uid);

    if (nullKey) {
      // 只有不是投票弹幕才计算发言速率
      slides.add(data.timestamp);
      speed.value = Math.exp(-slides.getAvg() / 1000);
    }

    // 设置弹幕OBJ
    let res = userManager.calDanmakuAndWeight(data.uid);
    let obj = {
      uid: data.uid,
      msg: data.msg,
      ...res
    }

    // 交付统计系统
    if (store.isOnStat) await emit("stat_data", {
      uid: data.uid,
      msg: data.msg,
      weight: 1,
    })

    // 普通弹幕不拥挤，发射弹幕
    if (speed.value < 0.75 ||
        (speed.value < 0.85 && Math.random() < 0.55) ||
        (speed.value < 0.95 && Math.random() < 0.25) ||
        Math.random() < 0.15
    ) {
      // 无论是否正在进行统计，过滤掉所有关键字弹幕
      // 否则以几率发射弹幕
      if (nullKey) danmakuRef.value.emit(obj);
    }
  }
}

function onGiftReceived(data: INFO_GIFT) {
  userManager.addGiftRecord(data.senderId, data.price);
}

async function decide(data) {
  // ------------- 间隔设定
  let baseline = -1;
  // 当间隔存在，且该用户不是第一次发言时，设定baseline
  if (store.filterConfig.interval !== -1 && userManager.hasSpeechRecord(data.uid)) {
    baseline = userManager.getSpeechRecord(data.uid) + 1000 * store.filterConfig.interval;
  }

  // ------------- 间隔设定结束

  // ------------- 过滤规则设定

  let thresh = 99999;

  if (store.filterConfig.rule !== 1) {
    // 当rule不等于1，则代表开启刷屏过滤，否则阈值无穷大
    switch (store.filterConfig.method) {
      case 2:
        thresh = store.filterConfig.thresh$2;
        break;
      case 3:
        thresh = store.filterConfig.thresh$3;
        break;
    }
  }

  // ------------- 过滤规则设定结束

  // ------------- 交付过滤器

  return await store.filterManager.executeAll({
    msg: data.msg,
    baseline: baseline,
    threshold: thresh,
    charsNumLower: 6,
  });
}

async function connect() {

  if (instance) {
    // 断开之前的连接，并重新连接
    await instance.disconnect();
    checkConnection();
    return;
  }
  // 没有新的连接，直接连接
  instance = new BilibiliWebsocket(store.shortRoomId, protoUrl);

  let p = `/room_${store.roomId}.json`;

  let content: string = await invoke("read_data", {
    src: p
  });

  store.transformer.load(content);


  checkConnection();
}

function checkConnection() {
  if (!instance) return;
  store.status = instance.connected ? "已连接" : "未连接";
  appWindow.setTitle(`房间号: ${store.shortRoomId} --- 状态:${store.status}`)
}


</script>

<style scoped lang="scss">
.container {
  display: flex;
  margin-top: 5px;
  width: 100%;
  flex: 1;
}

.menu {
  background: #393b63;
}

.item {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 55px;
  color: white;
  text-align: center;
  font-size: .8rem;
  padding: 7px;
  box-sizing: content-box;
  font-weight: bold;
  cursor: pointer;
}

.item_clicked {
  background: #ffffff;
  color: #393b63;

  .svg_icon {
    fill: #393b63;
  }
}

.svg_icon {
  width: 25px;
  height: 25px;
  fill: white;
  margin-bottom: 5px;
}

.view {
  flex: 1;
}

.test {
  position: absolute;
  font-size: .7rem;
}

</style>
