<template>
  <div class="btn">
    <label :for="hash">
      <input type="checkbox" :id="hash" :checked="checked" @change="$emit('update:checked', !checked)">
      <span class="wrapper"></span>
    </label>
  </div>
</template>

<script setup lang="ts">

const hash = (Math.random() * 1e9).toFixed(0);
defineProps(['checked']);

</script>

<style scoped lang="scss">
.wrapper {
  display: inline-block;
  position: relative;
  width: 60px;
  height: 30px;
  background-color: #e9e9e9;
  border-radius: 15px;
  transition: .3s all ease-in-out;
  cursor: pointer;
}

.wrapper::after {
  content: "";
  position: absolute;
  width: 22px;
  height: 22px;
  background-color: #ffffff;
  border-radius: 11px;
  top: 4px;
  transform: translateX(3px);
  box-shadow: 3px 0 12px rgba(0, 0, 0, .1);
  transition: .3s all ease-in-out;
}

input[type='checkbox'] {
  display: none;
}

input[type='checkbox']:checked + span {
  background-color: #68ce66;
}

input[type='checkbox']:checked + span::after {
  transform: translateX(35px);
  box-shadow: -3px 0 12px rgba(0, 0, 0, .1);
}

input[type='checkbox']:active + span::after {
  width: 35px;
}

input[type='checkbox']:checked:active + span::after {
  transform: translateX(22px);
}
</style>
