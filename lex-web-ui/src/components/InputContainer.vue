<template>
  <!-- v-footer app fixed -->
  <v-footer
    fixed
    height="100px"
  >
    <v-layout
      justify-center
      row
      wrap
    >
      <v-card style="width:100%;height:60px;" :color="inputboxColor">
        <v-layout row nowrap>
          <v-flex xs11>
            <transition name="fade">
        <v-text-field
          style="margin-left:10px;"
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
        </v-flex>
        <v-flex xs1>
          <transition name="fade">
        <v-btn
          style="margin-top:15px; margin-left:-5px;"
          v-show="shouldShowSendButton & readyForInput"
          v-on:click="postTextMessage"
          v-on="tooltipEventHandlers"
          v-bind:disabled="isSendButtonDisabled"
          ref="send"
          class="black--text input-button"
          icon
        >
          <v-icon medium style="color:#D12335">send</v-icon>
        </v-btn>
        </transition>
        </v-flex>
        </v-layout>
      </v-card>
      <v-card style="width:100%;height:40px;">
        <v-container fluid style="margin-top:-30px;" mx-0 px-0>
        <v-layout row nowrap justify-center>
      <v-layout row text-xs-left>
      <v-flex xs12
      >
        <a href="https://www.amplelabs.co/terms-conditions" target="_blank">
        <v-card-text justify-start ml-2 style="font-size:12px; margin-left:-5px">
          Terms &amp; Conditions
          </v-card-text>
        </a>
      </v-flex>
      </v-layout>
      <v-layout row text-xs-center>
      <v-flex xs12
      >
        <a href="https://www.amplelabs.co/chalmersbot-2" target="_blank">
          <v-card-text justify-center style="font-size:12px; margin-left:-10px;">
          Learn More
          </v-card-text>
        </a>
      </v-flex>
      </v-layout>
      <v-layout row text-xs-right>
      <v-flex xs12
      >
        <v-card-text justify-end
          @click="feedbackCB"
          style="color: #d12335; font-size:12px; font-weight:bold">
         Give Feedback
        </v-card-text>
      </v-flex>
      </v-layout>
        </v-layout>
        </v-container>
      </v-card>
    </v-layout>
    <v-dialog
      v-model="feedback"
      max-width="400"
    >
      <v-toolbar
        style="background-color:#D12335"
        dense
      >
        <v-toolbar-title class="white--text">ChalmersBot Feedback Form</v-toolbar-title>
        <v-spacer />
        <v-btn icon
          style="margin-right:-1.4em; padding-left:-12px"
          @click="feedback=false"
        >
          <v-icon color="white">
            close
          </v-icon> <span style="color:#D12335"></span>
        </v-btn>
      </v-toolbar>
      <v-card>
        <v-container
          fluid
          grid-list-lg
        >
          <v-layout column v-if="!feedbackSubmitted">
            <v-flex xs12>
              <v-card-text style="margin-left:-15px">Name (optional)</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              v-model="nameInput"
              outline
            ></v-text-field>
            </v-flex>
             <v-flex xs12>
              <v-card-text style="margin-left:-15px; margin-top: -30px">Feedback</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                style="margin-top: -30px"
                outline
                color="#d12335"
                name="input-7-4"
                v-model="feedbackInput"
              ></v-textarea>
            </v-flex>
            </v-layout>
            <v-layout row v-if="!feedbackSubmitted">
              <v-flex xs3>
                <v-btn
                  style="margin-left:-5px; color: #d12335;"
                  round outline small
                  @click="submitFeedback"
                >
                  Submit
                </v-btn>
              </v-flex>
              <v-flex xs9>
                <p class="text-xs-right">
                  Looking for other ways to get in touch? Email us at <a href="mailto:general@amplelabs.co">general@amplelabs.co.</a>
                </p>
              </v-flex>
          </v-layout>
          <v-layout row align-center v-else>
            <v-flex xs2>
            <v-icon large style="color:#D12335">check_circle</v-icon>
          </v-flex>
          <v-flex xs10 >
            <p class="text-xs-left font-weight-bold" style="color:#D12335">
              Success! <br> Your Feedback has been submitted.
            </p>
          </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
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
import axios from 'axios';
import uuid from 'uuid';

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
    submitFeedback() {
      this.feedbackSubmitted = true;
      // const postUrl = process.env.VUE_APP_CREATE_URL;
      // eslint-disable-next-line
      // console.log(process.env.VUE_APP_API_KEY_VALUE);
      const postUrl = 'https://1f2sneichf.execute-api.us-east-1.amazonaws.com/dev/feedback';
      // const VUE_APP_API_KEY_VALUE = '';
      const item = {
        id: uuid.v1(),
        name: this.nameInput === null || this.nameInput.length === 0 ? 'na' : this.nameInput,
        feedback: this.feedbackInput === null || this.feedbackInput.length === 0 ?
          'na' : this.feedbackInput,
      };
      // eslint-disable-next-line
      console.log(item);
      axios.post(postUrl, item, {
        headers: {
          'x-api-key': process.env.VUE_APP_API_KEY_VALUE,
        },
      })
        .then((resp) => {
          // resp.status === 200
          // resp.data === item
          // eslint-disable-next-line
          console.log(resp.status);
          this.feedbackSubmitted = false;
          this.feedback = false;
        })
        .catch((err) => {
          console.error(err);
        });
      /*
      const intervalId = setTimeout(() => {
        this.feedbackSubmitted = false;
        this.feedback = false;
        clearInterval(intervalId);
      }, 2000);
      */
    },
    feedbackCB() {
      this.feedback = true;
    },
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
