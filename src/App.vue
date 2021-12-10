<template>
  <div class="app">
    <Header />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Header from '@/components/Header.vue';

export default defineComponent({
  name: 'App',
  components: {
    Header,
  },
  beforeCreate() {
    this.$store.commit('initialiseStore');
  },
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: #161616;
  // background: url('../images/star-wars-background.jpg');
  // background-repeat: no-repeat;
  // background-size: cover;
  font-size: 1rem;
  color: #4a4a4a;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  width: 100%;
}

table {
  border-collapse: collapse;
}
</style>
