<template>
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>
<style>
/* 禁用 body 滚动，让内层滚动 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;  
}

#app {
  height: 100%;
}
</style>