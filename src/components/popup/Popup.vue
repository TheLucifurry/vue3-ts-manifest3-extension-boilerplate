<template>
  <div>
    <img class="logo" src="../../assets/logoVue.png" alt="Vue logo" />
    <img class="logo" src="../../assets/logoTS.png" alt="Typescript logo" />
    <h1>{{ caption }}</h1>
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    const caption = 'Hello Vue 3!';

    return {
      caption,
    };
  },
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 500px;
  height: 600px;
}
.logo {
  width: 150px;
  margin: 20px;
}
</style>
