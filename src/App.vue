<script>
import AppHeader from "@/components/AppHeader.vue";

export default {
  components: {
    AppHeader,
  },
};
</script>

<template>
  <div id="app">
    <!-- Thanh tiêu đề -->
    <AppHeader />

    <!-- Nội dung chính của từng trang (hiển thị qua router) -->
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<style>
.page {
  max-width: 400px;
  margin: auto;
}
</style>
