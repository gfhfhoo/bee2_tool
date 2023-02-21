<template>
  <div class="danmaku-basic danmaku-captain">
    <img src="../../assets/icon-l-3.402ac8f.png" class="danmaku-icon"/>
    {{ msg }}
  </div>
</template>

<script setup lang="ts">

defineProps({
  msg: String
})

</script>

<style lang="scss">
.danmaku-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.danmaku-captain {
  position: relative;
  display: flex;
  align-items: center;
  padding: 5px 10px 5px 5px;
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
