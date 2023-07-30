<template>
  <div class="about">
    <img class="author_img" src="../assets/92417d0ac583e5b9f69dabfe9212ab2e060cd30a.jpg@240w_240h_1c_1s.webp">
    <p class="author">作者：clay_ex</p>
    <p>本工具仅限 @觅2 使用</p>
    <p class="version">Ver 0.2.5</p>
    <p class="update_time">Updated at July 30, 2023</p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  width: 100%;
  height: 100%;
  padding: 20px 0;
  box-sizing: border-box;
}

.author_img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.author {
  font-weight: bold;
  font-size: 1.2rem;
  margin: 20px 0;
}

.version {
  font-weight: bold;
  font-size: .8rem;
  color: #a3a3a3;
  margin: 20px 0;
}

.update_time {
  font-weight: bold;
  font-size: .8rem;
  color: #a3a3a3;
}
</style>
