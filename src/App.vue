<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
}
</style>
