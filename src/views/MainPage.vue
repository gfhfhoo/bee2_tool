<template>
  <div class="config">
    <div class="broadcast">
      <div>
        <span class="name">房间号：</span>
        <input placeholder="输入房间号..." v-model="store.shortRoomId" style="width: 110px"/>
        <button class="btn connect" @click="$$emit('requestConnect')">连接</button>
        <span class="tip">连接状态：{{ store.status }}</span>
      </div>
    </div>
    <div class="filter">
      <div>
        <span class="name">发言间隔(秒)：</span>
        <input placeholder="输入整数" v-model.number="_interval" style="width: 80px">
        <button class="btn apply" @click="store.bindUserSpeechIntervalFn">应用</button>
        <span class="tip">注意：-1代表不限制</span>
      </div>
    </div>
    <div class="filter">
      <div>
        <span class="name">刷屏过滤规则：</span>
        <label><input class="radio_filter" type="radio" value="1" v-model.number="_rule">不过滤</label>
        <label><input class="radio_filter" type="radio" value="2" v-model.number="_rule">完全过滤</label>
      </div>
    </div>
    <div class="filter">
      <div>
        <span class="name">刷屏过滤方法：</span>
        <label><input class="radio_filter" type="radio" value="1" v-model.number="_method">过滤英文和字母</label>
        <label><input class="radio_filter" type="radio" value="2" v-model.number="_method">字符统计法</label>
        <label><input class="radio_filter" type="radio" value="3" v-model.number="_method">分词法</label>
      </div>
    </div>
    <!--      字符统计法-->
    <div class="filter" v-show="store.filterConfig.method===2">
      <div>
        <span class="name">字符统计阈值：</span>
        <input type="range" min="0" max="1" v-model.number="_thresh$2" step="0.05" style="width: 110px">
        <span>{{ store.filterConfig.thresh$2 }}</span>
      </div>
    </div>
    <!--      分词法-->
    <div class="filter" v-show="store.filterConfig.method===3">
      <div>
        <span class="name">分词阈值：</span>
        <input type="range" min="0" max="1" v-model.number="_thresh$3" step="0.05" style="width: 110px">
        <span>{{ store.filterConfig.thresh$3 }}</span>
      </div>
    </div>
    <div class="filter">
      <div>
        <span class="name">弹幕统计关键字：</span>
        <input placeholder="输入一个关键字" v-model="input" style="width: 110px">
        <button class="btn add_key" @click="addKey">添加</button>
        <div class="filter">
          <span class="name">倒计时(秒)：</span>
          <input placeholder="输入一个整数" v-model.number="_countdown" style="width: 50px"/>
          <button class="btn apply" @click="applyCountdown">应用</button>
        </div>
        <div class="btn_group">
          <button class="btn start" @click="startStat" :class="{btn_disabled: store.isOnStat}">开始统计</button>
          <button class="btn stop" @click="stopStat" :class="{btn_disabled: !store.isOnStat}">停止统计</button>
          <button class="btn clear_key" @click="clearKeys">清空并重置饼状图</button>
          <button class="btn open" @click="tryCreateStatWindow">打开统计窗口</button>
        </div>
      </div>
      <div class="keys">
        <div class="key_item"
             @click="delKey(i)"
             v-for="(ele,i) in store.keys">{{ ele }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useConfigStore} from "../store/config";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {emit, listen, TauriEvent} from "@tauri-apps/api/event";
import {appWindow, WebviewWindow} from "@tauri-apps/api/window";

const store = useConfigStore();
const $$emit = defineEmits(['requestConnect'])
let statWindow: any;

// reactive

const _interval = ref(-1);
const _rule = ref(1);
const _method = ref(1);
const _thresh$2 = ref(.8);
const _thresh$3 = ref(.8);
const input = ref("");
const statWindowListened = ref<boolean>(false);
const _countdown = ref(60);

onMounted(() => {
  listen("stat_timeUp", () => {
    stopStat();
  })
})


async function startStat() {
  store.isOnStat = true;
  await emit("stat_clear");
  await emit("stat_legend", store.keys);
  await emit("stat_start", {countdown: store.countdown});
}

function stopStat() {
  store.isOnStat = false;
  emit("stat_stop", {});
}


function clearKeys() {
  store.keys = [];
  store.isOnStat = false;
  emit("stat_clear");
}

function delKey(idx) {
  store.keys = store.keys.filter((n, i) => !(i === idx));
  if (store.keys.length === 0) store.isOnStat = false;
}

function addKey() {
  if (input.value === "") return;
  if (!store.keys.includes(input.value)) store.keys.push(input.value);
  input.value = "";
  emit("stat_legend", store.keys)
}

function applyCountdown() {
  store.countdown = _countdown.value;
}

async function tryCreateStatWindow() {
  if (!statWindow) {
    statWindow = new WebviewWindow("stat", {
      height: 350,
      width: 350,
      resizable: false,
      title: "投票统计",
      url: "stat.html",
      decorations: false,
      alwaysOnTop: true,
    });
    // todo: why I must judge it to avoid multiple calls to `listen` function?
    // todo: [may be we just need create it once time, so that we can invoke `show`?/`hide`?]
    if (!statWindowListened.value) {
      statWindow.listen(TauriEvent.WINDOW_DESTROYED, () => {
        statWindow = null;
      });
      statWindowListened.value = true;
    }
  }
}

async function tryDestroyStatWindow() {
  if (statWindow) await statWindow.close();
}

onMounted(() => {
  // bind windows events
  appWindow.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
    tryDestroyStatWindow();
    appWindow.close();
  });
})

onBeforeUnmount(async () => {
  await tryDestroyStatWindow();
})

watch([_interval, _rule, _method, _thresh$2, _thresh$3],
    ([_interval$new, _rule$new, _method$new, _thresh$2$new, _thresh$3$new]) => {
      store.filterConfig.rule = _rule$new;
      store.filterConfig.interval = _interval$new;
      store.filterConfig.method = _method$new;
      store.filterConfig.thresh$2 = _thresh$2$new;
      store.filterConfig.thresh$3 = _thresh$3$new;
    });


</script>

<style scoped lang="scss">
.btn {
  margin-left: 5px;
  margin-right: 5px;
  padding: 10px 15px;
  box-sizing: border-box;
  border-radius: 10px;
  border-style: none;
  font-size: .8rem;
  font-weight: bold;
  color: white;
  background: #2f60f8;
  cursor: pointer;
  transition: background-color .3s linear;
}

.btn_disabled {
  cursor: not-allowed;
  background: #6f6f6f;
}

.btn_disabled:hover {
  background: #6f6f6f !important;
}

.btn:hover {
  background: #1a3eb4;
}

.config {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

  .name {
    display: inline-block;
    width: 150px;
  }

  .tip {
    margin-left: 10px;
    color: #c93939;
    font-size: .8rem;
  }
}

.config > div {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  margin: 10px 0;
}

.filter, .broadcast {
  input {
    padding: 10px 5px;
    box-sizing: border-box;
    font-size: .8rem;
    outline: none;
  }
}

.keys {
  display: flex;
  margin-top: 10px;

  .key_item {
    display: inline-block;
    margin-right: 5px;
    padding: 5px 10px;
    box-sizing: border-box;
    background: #49bde1;
    color: white;
    font-weight: bold;
    font-size: .7rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color .3s linear;
  }

  .key_item:hover {
    background: #2b7386;
  }
}

.btn_group {
  margin: 10px 0;
}

.radio_filter {
  margin: 0 5px;
}
</style>
