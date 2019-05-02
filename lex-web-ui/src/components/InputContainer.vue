<template>
  <!-- v-footer app fixed -->
  <v-footer
    fixed
    height="80px"
  >
    <v-layout
      justify-center
      row
      wrap
    >
      <v-card style="width:100%;height:60px;" :color="inputboxColor">
        <v-layout row nowrap>
          <v-flex xs12>
            <transition name="fade">
        <v-text-field
          :disabled="!readyForInput"
          style="margin-right:15px; margin-left:10px"
          v-bind:label="textInputPlaceholder"
          v-model="textInput"
          v-on:keyup.enter.stop="postTextMessage"
          v-on:focus="onTextFieldFocus"
          v-on:blur="onTextFieldBlur"
          color="red darken-2"
          id="text-input"
          name="text-input"
          single-line
          hide-details
          append-icon="send"
          @click:append="postTextMessage"
        ></v-text-field>
        </transition>
        </v-flex>
        </v-layout>
      </v-card>
      <v-card style="width:100%;height:20px;">
      </v-card>
    </v-layout>
  </v-footer>
</template>
<script>
/*
Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file
except in compliance with the License. A copy of the License is located at

http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed on an "AS IS"
BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the
License for the specific language governing permissions and limitations under the License.
*/
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import RecorderStatus from '@/components/RecorderStatus';

export default {
  name: 'input-container',
  data() {
    return {
      textInput: '',
      inputboxColor: 'white',
      isTextFieldFocused: false,
      shouldShowTooltip: false,
      // workaround: vuetify tooltips doesn't seem to support touch events
      tooltipEventHandlers: {
        mouseenter: this.onInputButtonHoverEnter,
        mouseleave: this.onInputButtonHoverLeave,
        touchstart: this.onInputButtonHoverEnter,
        touchend: this.onInputButtonHoverLeave,
        touchcancel: this.onInputButtonHoverLeave,
      },
      feedback: false,
      feedbackSubmitted: false,
      nameInput: null,
      feedbackInput: null,
    };
  },
  props: ['textInputPlaceholder', 'initialSpeechInstruction'],
  components: {
    RecorderStatus,
  },
  watch: {
    readyForInput(val) {
      if (val) {
        this.inputboxColor = 'white';
        return;
      }
      this.inputboxColor = '#f3f4f5';
    },
  },
  computed: {
    readyForInput() {
<<<<<<< HEAD
      // eslint-disable-next-line no-console
      // console.log(!this.$store.state.botIsTexting);
=======
>>>>>>> f659374d63408ec58424c5491870e0cf30677c31
      return !this.$store.state.botIsTexting;
    },
    isBotSpeaking() {
      return this.$store.state.botAudio.isSpeaking;
    },
    isSpeechConversationGoing() {
      return this.$store.state.recState.isConversationGoing;
    },
    isMicButtonDisabled() {
      return this.isMicMuted;
    },
    isMicMuted() {
      return this.$store.state.recState.isMicMuted;
    },
    isRecorderSupported() {
      return this.$store.state.recState.isRecorderSupported;
    },
    isRecorderEnabled() {
      return this.$store.state.recState.isRecorderEnabled;
    },
    isSendButtonDisabled() {
      return false;
    },
    micButtonIcon() {
      if (this.isMicMuted) {
        return 'mic_off';
      }
      if (this.isBotSpeaking || this.isSpeechConversationGoing) {
        return 'stop';
      }
      return 'mic';
    },
    inputButtonTooltip() {
      if (this.shouldShowSendButton) {
        return 'send';
      }
      if (this.isMicMuted) {
        return 'mic seems to be muted';
      }
      if (this.isBotSpeaking || this.isSpeechConversationGoing) {
        return 'interrupt';
      }
      return 'click to use voice';
    },
    shouldShowSendButton() {
      return (
        (this.textInput.length && this.isTextFieldFocused) ||
        (!this.isRecorderSupported || !this.isRecorderEnabled)
      );
    },
    shouldShowTextInput() {
      return true; // disable transition
    },
  },
  methods: {
    onInputButtonHoverEnter() {
      this.shouldShowTooltip = true;
    },
    onInputButtonHoverLeave() {
      this.shouldShowTooltip = false;
    },
    onMicClick() {
      this.onInputButtonHoverLeave();
      if (this.isBotSpeaking || this.isSpeechConversationGoing) {
        return this.$store.dispatch('interruptSpeechConversation');
      }
      if (!this.isSpeechConversationGoing) {
        return this.startSpeechConversation();
      }

      return Promise.resolve();
    },
    onTextFieldFocus() {
      this.isTextFieldFocused = true;
    },
    onTextFieldBlur() {
      if (!this.textInput.length && this.isTextFieldFocused) {
        this.isTextFieldFocused = false;
      }
    },
    playInitialInstruction() {
      const isInitialState = ['', 'Fulfilled', 'Failed']
        .some(initialState => (
          this.$store.state.lex.dialogState === initialState
        ));

      return (isInitialState) ?
        this.$store.dispatch(
          'pollySynthesizeSpeech',
          this.initialSpeechInstruction,
        ) :
        Promise.resolve();
    },
    postTextMessage() {
      this.onInputButtonHoverLeave();
      this.textInput = this.textInput.trim();
      // empty string
      if (!this.textInput.length) {
        return Promise.resolve();
      }

      const message = {
        type: 'human',
        text: this.textInput,
      };

      // return this.$store.dispatch('postTextMessage', message)
      return this.$store.dispatch('postTextMessageFromUser', message)
        .then(() => {
          this.textInput = '';
        });
    },
    startSpeechConversation() {
      if (this.isMicMuted) {
        return Promise.resolve();
      }
      return this.setAutoPlay()
        .then(() => this.playInitialInstruction())
        .then(() => this.$store.dispatch('startConversation'))
        .catch((error) => {
          console.error('error in startSpeechConversation', error);
          const errorMessage = (this.$store.state.config.ui.showErrorDetails) ?
            ` ${error}` : '';

          this.$store.dispatch(
            'pushErrorMessage',
            "Sorry, I couldn't start the conversation. Please try again." +
            `${errorMessage}`,
          );
        });
    },
    /**
     * Set auto-play attribute on audio element
     * On mobile, Audio nodes do not autoplay without user interaction.
     * To workaround that requirement, this plays a short silent audio mp3/ogg
     * as a reponse to a click. This silent audio is initialized as the src
     * of the audio node. Subsequent play on the same audio now
     * don't require interaction so this is only done once.
     */
    setAutoPlay() {
      if (this.$store.state.botAudio.autoPlay) {
        return Promise.resolve();
      }
      return this.$store.dispatch('setAudioAutoPlay');
    },
  },
};
</script>
<style scoped>
.v-text-field input {
    font-size: 16px;
}

.footer {
  /* make footer same height as dense toolbar */
  height: 100px;
}

.reference {
  height: 48px; /* 48px; */
  background-color: white;
}

.reference-card {
  margin-top:-48px;
}

.cgred {
  color: #d12335;
}

a {
  color: #d12335 !important;
  text-decoration: none;
}

a:link {
  color: #d12335 !important;
  text-decoration: none;
}
.fade-enter-active, .fade-leave-active {
  transition: all 1.5s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
