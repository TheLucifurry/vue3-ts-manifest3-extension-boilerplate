<template>
  <div>
    <h1>{{ caption }}</h1>
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    const caption = 'Options';
    return {
      caption,
    };
  },
};
</script>

<style>
</style>
