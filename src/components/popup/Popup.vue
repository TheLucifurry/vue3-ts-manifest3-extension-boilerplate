<template>
  <div>
    <h1>{{ caption }}</h1>
    <span> Time: {{ time }} </span>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, watch } from 'vue';

export default {
  // components: { RepositoriesFilters },
  setup() {
    const caption = 'Hello Vue 3!';
    const time = ref('');

    function updateTime() {
      time.value = new Date().toLocaleTimeString();
    }
    setInterval(updateTime, 1000);
    updateTime();

    onMounted(() => {
      console.log('Popup is mounted');
    });

    watch(time, (newValue, oldValue) => {
      console.log(`Новое значение time: ${newValue}`);
    });

    return {
      caption,
      time,
    };
  },
};
</script>

<style>
#root {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 500px;
  height: 600px;
}
</style>
