<template>
  <div class="sys_config">
    <div class="item">
      <span>玩家数据保存</span>
      <button class="btn" @click="saveData">保存</button>
      <span class="store_status">{{ status }}</span>
    </div>
    <div class="item">
      <span>玩家数据显示</span>
      <IOSSwitcher style="margin-left: 10px;" v-model:checked="showSwitch"></IOSSwitcher>
    </div>
  </div>
</template>

<script setup lang="ts">
import IOSSwitcher from "../components/tiny/IOSSwitcher.vue";
import {useConfigStore} from "../store/config";
import {onMounted, ref, watch} from "vue";
import {invoke} from "@tauri-apps/api";
import {useStatStore} from "../store/stat";

const store = useConfigStore();
const statStore = useStatStore();

const showSwitch = ref(false);

const status = ref("")

onMounted(() => {

})

async function saveData() {
  if (store.roomId !== '') {
    store.transformer.update();
    if (!statStore.internal_voting_map) {
      status.value = "尚未有投票记录！"
      return;
    }
    let ret = store.transformer.transform(statStore.internal_voting_map);
    invoke("generate_data", {
      dst: `/room_${store.roomId}.json`,
      input: ret
    }).then(() => {
      status.value = "已保存在当前目录下！"
    }).catch((e) => {
      status.value = `保存失败，原因：${e.toString()}`
    })
  }
}

watch([showSwitch], ([showSwitch$new]) => {
  store.showPlayerData = showSwitch$new;
})
</script>

<style scoped lang="scss">
.sys_config {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.item {
  display: flex;
  align-items: center;
  min-height: 50px;
  border-bottom: 1px solid #d3d3d3;
}

.btn:hover {
  background: #1a3eb4;
}

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
</style>
