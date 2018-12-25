<template>
  <span>{{ progress }} </span>
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
.message, .message-bubble-column {
  flex: 0 0 auto;
}

.message, .message-bubble-row {
  max-width: 80vw;
}

.message-bubble {
  border-radius: 24px;
  display: inline-flex;
  font-size: calc(1em + 0.25vmin);
  padding: 0 12px;
  width: fit-content;
  align-self: center;
}


.message-bot .message-bubble {
  background-color: #FFFFFF;
}

</style>
