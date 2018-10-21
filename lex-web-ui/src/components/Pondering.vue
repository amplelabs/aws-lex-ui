<template>
  <span>{{ progress }}</span>  
</template>

<script>
export default {
  name: 'pondering',
  data() {
    return {
      progress: '.',
    };
  },
  computed: {
  },
  methods: {
  },
  created() {
    this.interval = setInterval(() => {
      if (this.progress.length > 2) {
        this.progress = '.';
      } else {
        this.progress += '.';
      }
    }, 1000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>

</style>
