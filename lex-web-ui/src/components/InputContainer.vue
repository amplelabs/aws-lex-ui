<template>
  <v-footer app fixed>
    <v-layout
      column
      justify-space-between
      ma-0
      class="input-container"
    >
      <v-toolbar :color="inputboxColor" dense flat>
        <!--
          using v-show instead of v-if to make recorder-status transition work
        -->
        <transition name="fade">
        <v-text-field style="height:48px; margin-top:-20px;"
          v-bind:label="textInputPlaceholder"
          v-show="shouldShowTextInput & readyForInput"
          v-model="textInput"
          v-on:keyup.enter.stop="postTextMessage"
          v-on:focus="onTextFieldFocus"
          v-on:blur="onTextFieldBlur"
          color="red darken-2"
          id="text-input"
          name="text-input"
          single-line
          hide-details
        ></v-text-field>
        </transition>
        <recorder-status
          v-show="!shouldShowTextInput"
        ></recorder-status>

        <!-- separate tooltip as a workaround to support mobile touch events -->
        <!-- tooltip should be before btn to avoid right margin issue in mobile -->
        <v-tooltip
          activator=".input-button"
          v-model="shouldShowTooltip"
          ref="tooltip"
          left
        >
          <span id="input-button-tooltip">{{inputButtonTooltip}}</span>
        </v-tooltip>
        <div v-show="readyForInput">
        <v-btn
          v-if="shouldShowSendButton"
          v-on:click="postTextMessage"
          v-on="tooltipEventHandlers"
          v-bind:disabled="isSendButtonDisabled"
          ref="send"
          class="black--text input-button"
          icon
        >
          <v-icon medium style="color:#D12335">send</v-icon>
        </v-btn>
        <v-btn
          v-else
          v-on:click="onMicClick"
          v-on="tooltipEventHandlers"
          v-bind:disabled="isMicButtonDisabled"
          ref="mic"
          class="black--text input-button"
          icon
        >
          <v-icon medium style="color:#D12335">{{micButtonIcon}}</v-icon>
        </v-btn>
        </div>
        
      </v-toolbar>
      <!-- v-content class="reference">
        <v-container fluid grid-list-sm mb-1 pt-0>
          <v-layout row>
            <v-flex xs4>
              <v-card flat class="reference-card">
                <a href="https://www.amplelabs.co/">
                <v-card-text class="highlighted "
                style="font-size:12px; margin-top:-60px; margin-left:-10px, padding-left:0px;"
                >Terms &#38; Conditions</v-card-text>
                </a>
              </v-card>
            </v-flex>
            <v-flex xs4>
              <v-card flat class="reference-card white--text" style="background-color: #d12335;">
                <a href="https://www.amplelabs.co/">
                <v-card-text class="highlighted text-xs-right font-italic">Learn More</v-card-text>
                </a>
              </v-card>
            </v-flex>
            <v-flex xs4>
              <v-card flat class="reference-card white--text" style="background-color: #d12335;">
                <a href="https://www.amplelabs.co/">
                <v-card-text class="highlighted text-xs-right font-italic">Give Feedback</v-card-text>
                </a>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content -->
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
      inputboxColor: 'grey lighten-4',
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
      this.inputboxColor = 'grey lighten-4';
    },
  },
  computed: {
    readyForInput() {
      // eslint-disable-next-line no-console
      // console.log(!this.$store.state.botIsTexting);
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
      return false; // this.textInput.length < 1;
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
      return !(this.isBotSpeaking || this.isSpeechConversationGoing);
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
  height: 48px;
}

.reference {
  height: 48px; /* 48px; */
  background-color: white;
}


.reference-card {
  margin-top:-48px;
  /* background-color: #d12335;
  color: white; */
}

.cgred {
  color: #d12335;
}

/*
.highlighted {
  font-style: italic;
}
*/
a {
  color: #d12335 !important;
  text-decoration: none;
}

a:link {
  color: #d12335 !important;
  text-decoration: none;
}
.fade-enter-active, .fade-leave-active {
  /* transition: opacity 1.5s; */
  transition: all 1.5s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
