<template>
  <div>
    <Header />
    <div class="page">
      <SidebarLeft />
      <div class="main">
        <nuxt/>
      </div>
    </div>
  </div>
</template>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

.page {
  display: flex;
}
.main {
  display: flex;
  flex-direction: column;
  padding: 20px 60px;
  width: calc(100vw - 280px);
  overflow-y: auto;
  height: calc(100vh - 104px);
}
</style>

<script setup>
import Header from "../components/Header.vue";
import SidebarLeft from "../components/SidebarLeft.vue";

</script>
