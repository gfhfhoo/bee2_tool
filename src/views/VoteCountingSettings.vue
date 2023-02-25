<template>
  <div class="settings">
    <div class="main_switch btn_group">
      <span>总开关</span>
      <IOSSwitcher style="margin-left: 10px;" v-model:checked="mainSwitch"></IOSSwitcher>
    </div>
    <div class="container">
      <div class="config_group btn_group">
        <div class="config_name">
          <span class="name">礼物配置</span>
          <IOSSwitcher v-model:checked="giftSwitch"></IOSSwitcher>
        </div>
        <div class="content">
          <div class="item">
            <span>1.当累积送出电池达到<input v-model.number="_price"/>时触发本场变色弹幕</span>
          </div>
          <div class="item">
            <span>2.投票权重</span>
            <input v-model.number="_giverWeight"/>
          </div>
        </div>
      </div>
      <div class="config_group btn_group">
        <div class="config_name">
          <span class="name">舰长配置</span>
          <IOSSwitcher v-model:checked="captainSwitch"></IOSSwitcher>
        </div>
        <div class="content">
          <div class="item">
            <span>1.当舰长发言时触发炫彩弹幕</span>
          </div>
          <div class="item">
            <span>2.投票权重</span>
            <input v-model.number="_captainWeight"/>
          </div>
        </div>
      </div>
      <div class="config_group btn_group">
        <div class="config_name">
          <span class="name">留言配置</span>
          <IOSSwitcher v-model:checked="messageSwitch"></IOSSwitcher>
        </div>
        <div class="content">
          <div class="item">
            <span>1.累积留言条数阈值</span>
            <input v-model.number="_messageThresh"/>
          </div>
          <div class="item">
            <span>2.投票权重</span>
            <input v-model.number="_talkerWeight"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IOSSwitcher from "../components/tiny/IOSSwitcher.vue";
import {ref, watch} from "vue";
import {useConfigStore} from "../store/config";

const store = useConfigStore()

const _price = ref(50);
const _messageThresh = ref(50);

const _giverWeight = ref(2);
const _captainWeight = ref(2);
const _talkerWeight = ref(2);

const mainSwitch = ref(false);
const giftSwitch = ref(false);
const captainSwitch = ref(false);
const messageSwitch = ref(false);

watch([mainSwitch, giftSwitch, captainSwitch, messageSwitch],
    ([mainSwitch$new, giftSwitch$new, captainSwitch$new, messageSwitch$new]) => {
      store.specialDanmakuSwitch = mainSwitch$new;
      store.giftConfig.status = giftSwitch$new;
      store.messageConfig.status = messageSwitch$new;
      store.captainConfig.status = captainSwitch$new;
    });

watch([_price, _messageThresh, _giverWeight, _talkerWeight, _captainWeight],
    ([_price$new, _messageThresh$new, _giverWeight$new, _talkerWeight$new, _captainWeight$new]) => {
      store.messageConfig.triggerThresh = _messageThresh$new;
      store.messageConfig.votingWeight = _talkerWeight$new;

      store.giftConfig.triggerThresh = _price$new;
      store.giftConfig.votingWeight = _giverWeight$new;

      store.captainConfig.votingWeight = _captainWeight$new;
    })

</script>

<style scoped lang="scss">

.settings {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.main_switch {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 5px 0;
}

.btn_group {
  display: flex;
  align-items: center;
  font-size: .9rem;
  font-weight: bold;
}

.container {
  display: flex;
  flex-direction: column;
}

.config_group {
  padding: 8px 0;
  border-bottom: 1px solid #d3d3d3;
}

.config_name {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;

  .name {
    margin-bottom: 5px;
  }
}

.content {
  display: flex;
  flex-direction: column;

  .item {
    margin: 10px 0;
  }

  input {
    width: 80px;
    padding: 2px 5px;
    margin: 0 5px;
    box-sizing: border-box;
    font-size: .8rem;
    outline: none;
  }
}
</style>
