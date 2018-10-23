<template>
  <span>{{ progress }} </span>
  <!-- v-flex d-flex class="message message-bot">
    <v-layout column ma-2 class="message-layout">
      <v-flex d-flex class="message-bubble-date-container">
        <v-layout column class="message-bubble-column">
          <v-flex d-flex class="message-bubble-avatar-container">
            <v-layout row class="message-bubble-row">
              <div
                class="message-bubble focusable"
              >
                {{ progress }} 
              </div>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-flex -->
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
  background-color: #FFFFFF; /* #FFEBEE; */ /* red-50 from material palette */
}

</style>
