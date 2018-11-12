<template>
  <v-toolbar style="background-color:#D12335"
    app
    dense
    flat
    fixed
  >
    <img width="40" style="margin-left:-0em; padding-left:12px; padding-top:9px; padding-bottom:9px"
      v-if="toolbarLogo" v-bind:src="toolbarLogo">
    <v-toolbar-title ma-0 pa-0 class="hidden-xs-and-down">
      <span class="white--text">{{ toolbarTitle }}</span>
    </v-toolbar-title>
    <v-spacer />
    <!-- tooltip should be before btn to avoid right margin issue in mobile -->
    <v-tooltip
      v-model="shouldShowTooltip"
      activator=".min-max-toggle"
      left
    >
      <!-- span id="min-max-tooltip">{{toolTipMinimize}}</span -->
    </v-tooltip>
    <v-btn icon
      style="margin-right:-1.4em; padding-left:-12px"
      @click="feedbackCB"
    >
      <v-icon color="white">
        feedback
      </v-icon> <span style="color:#D12335"></span>
    </v-btn>
    <v-dialog
      v-model="feedback"
      max-width="400"
    >
      <v-toolbar
        style="background-color:#D12335"
        dense
      >
        <v-toolbar-title class="white--text">ChamlersBot Feedback Form</v-toolbar-title>
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
          <v-layout column>
            <v-flex xs12>
              <v-card-text style="margin-left:-15px">Name (optional)</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
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
              ></v-textarea>
            </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs3>
                <v-btn
                  style="margin-left:-5px; color: #d12335;"
                  round outline small
                  @click="feedback = false;"
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
        </v-container>
      </v-card>
    </v-dialog>
    &nbsp; &nbsp;
    <v-btn icon
      style="margin-right:-1.4em; padding-left:-12px"
      @click="shareCB"
    >
      <v-icon color="white">
        share
      </v-icon> <span style="color:#D12335"></span>
    </v-btn>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
    <v-toolbar
      style="background-color:#D12335"
      dense
    >
      <v-toolbar-title class="white--text">Share ChalmersBot</v-toolbar-title>
      <v-spacer />
      <v-btn icon
        style="margin-right:-1.4em; padding-left:-12px"
        @click="dialog=false"
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
        <v-layout column v-if="!shareConfirm">
          <v-flex xs12>
            <v-text-field
              color="red"
              v-model="url"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-btn
              style="margin-left:-5px; color: #d12335;"
              round outline small
              @click="copyToClipboard"
            >
              Copy URL
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row wrap v-else>
            <v-flex offset-xs2>
              <v-card-text>Link Copied</v-card-text>
            </v-flex>
            <v-flex xs4>
              <v-btn fab small style="color: #d12335;">
                <v-icon>check</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
      </v-container>
    </v-card>
    </v-dialog>
  </v-toolbar>
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
export default {
  name: 'toolbar-container',
  data() {
    return {
      // from https://bitly.com/
      url: 'https://chalmersbot.amplelabs.co', // 'https://amplebot-3d467.firebaseapp.com/#/',
      dialog: false,
      feedback: false,
      shareConfirm: false,
      shouldShowTooltip: false,
      tooltipEventHandlers: {
        mouseenter: this.onInputButtonHoverEnter,
        mouseleave: this.onInputButtonHoverLeave,
        touchstart: this.onInputButtonHoverEnter,
        touchend: this.onInputButtonHoverLeave,
        touchcancel: this.onInputButtonHoverLeave,
      },
    };
  },
  props: ['toolbarTitle', 'toolbarColor', 'toolbarLogo', 'isUiMinimized'],
  computed: {
    toolTipMinimize() {
      return (this.isUiMinimized) ? 'maximize' : 'minimize';
    },
  },
  methods: {
    copyToClipboard() {
      // https://developers.google.com/web/updates/2018/03/clipboardapi
      navigator.clipboard.writeText(this.url)
        .then(() => {
          // console.log('Text copied to clipboard');
          // this.dialog = false;
          this.shareConfirm = true;
          const intervalId = setTimeout(() => {
            this.shareConfirm = false;
            this.dialog = false;
            clearInterval(intervalId);
          }, 1000);
        })
        .catch((err) => {
          // This can happen if the user denies clipboard permissions:
          // eslint-disable-next-line
          console.error('Could not copy text: ', err);
        });
      /*
      const el = document.createElement('textarea');
      el.value = this.url;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      */
      // this.dialog = false;
    },
    feedbackCB() {
      this.feedback = true;
    },
    shareCB() {
      this.dialog = true;
    },
    onInputButtonHoverEnter() {
      this.shouldShowTooltip = true;
    },
    onInputButtonHoverLeave() {
      this.shouldShowTooltip = false;
    },
    toggleMinimize() {
      this.onInputButtonHoverLeave();
      this.$emit('toggleMinimizeUi');
    },
  },
};
</script>

<style scoped>
.cg {
  background-color: #ffcb01;
}

.cgshare {
  color: #ffffff;
  text-transform: capitalize;
}

.v-text-field input {
  color: #d12335;
  font-size:0.8em !important;
}

.cgred {
  color: #d12335;
}

a {
  color:black !important;
  text-decoration: none;
}

a:link {
  color:black !important;
  text-decoration: none;
}

</style>
