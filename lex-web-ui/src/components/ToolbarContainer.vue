<template>
  <v-toolbar style="background-color:#D12335"
    app
    dense
    flat
    fixed
  >
    <img width="40" style="margin-left:-1.5em; padding-left:12px; padding-top:9px; padding-bottom:9px"
      v-if="toolbarLogo" v-bind:src="toolbarLogo">
    <v-toolbar-title ma-0 pa-0 class="hidden-xs-and-down">
      <span class="white--text"
      style="font-size:18px; font-weight: bold;"
      >{{ toolbarTitle }}</span>
    </v-toolbar-title>
    <v-spacer />
    <!-- tooltip should be before btn to avoid right margin issue in mobile -->
    <v-tooltip
      v-model="shouldShowTooltip"
      activator=".min-max-toggle"
      left
    >
    </v-tooltip>
    <!-- TODO: remove feedback stuff from here ... it is now in the input container -->
    <!-- v-btn icon
      style="margin-right:-1.4em; padding-left:-12px"
      @click="feedbackCB"
    >
      <v-icon color="white">
        feedback
      </v-icon> <span style="color:#D12335"></span>
    </v-btn -->
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
    &nbsp; &nbsp;
    <v-dialog
      v-model="resource"
      max-width="400"
    >
      <v-toolbar
        style="background-color:#D12335"
        dense
      >
        <v-toolbar-title class="white--text">ChalmersBot Add New Resource</v-toolbar-title>
        <v-spacer />
        <v-btn icon
          style="margin-right:-1.4em; padding-left:-12px"
          @click="resource=false"
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
          <v-layout column v-if="!resourceSubmitted">
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Name of the Organization</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              placeholder="Organization Name"
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Nickname</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              placeholder="What it's known as in the community"
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Address</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              placeholder="Address 1"
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              placeholder="Address 2"
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              placeholder="Address 3"
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              placeholder="Address 4"
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              placeholder="City"
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              placeholder="Postal Code"
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Phone Number</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              placeholder="Phone Number"
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Website</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              placeholder="http://"
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Email</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              maxlength="50"
            ></v-text-field>
            </v-flex>
             <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Description</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                style="margin-top: -30px"
                outline
                color="#d12335"
                placeholder="Describe the organization in 1-2 sentences. Avoid listing the services it provides and instead explain the organization's mission"
                name="input-7-4"
              ></v-textarea>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Legal Status</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              style="margin-top: -30px"
              color="#d12335"
              outline
              placeholder="eg non-profit, government, business"
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <!-- TODO: Add hour selections -->
            </v-layout>
            <v-layout row v-if="!resourceSubmitted">
              <v-flex xs3>
                <v-btn
                  style="margin-left:-5px; color: #d12335;"
                  round outline small
                  @click="submitResource"
                >
                  Submit
                </v-btn>
              </v-flex>
          </v-layout>
          <v-layout row align-center v-else>
            <v-flex xs2>
            <v-icon large style="color:#D12335">check_circle</v-icon>
          </v-flex>
          <v-flex xs10 >
            <p class="text-xs-left font-weight-bold" style="color:#D12335">
              Success! <br> Your Resource has been submitted.
            </p>
          </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    &nbsp; &nbsp;
    <v-btn icon
      style="margin-right:-10.0px; padding-left:-0px"
      @click="shareCB"
    >
      <v-icon color="white">
        share
      </v-icon> <span style="color:#D12335"></span>
    </v-btn>
    <v-dialog
      v-model="dialog"
      max-width="350"
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
        <v-layout align-center row v-if="!shareConfirm">
          <v-flex xs8>
            <v-text-field
              color="red"
              v-model="url"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-btn
              style="margin-left:-5px; color: #d12335;"
              round outline small
              @click="copyToClipboard"
            >
              Copy URL
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row wrap text-xs-right v-else>
          <v-flex xs4>
            <v-icon large style="color:#D12335">check_circle</v-icon>
          </v-flex>
          <v-flex xs8 >
            <p class="text-xs-left font-weight-bold" style="color:#D12335">
              Success! <br> Link copied!
            </p>
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
      resource: false,
      shareConfirm: false,
      feedbackSubmitted: false,
      resourceSubmitted: false,
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
    submitFeedback() {
      this.feedbackSubmitted = true;
      const intervalId = setTimeout(() => {
        this.feedbackSubmitted = false;
        this.feedback = false;
        clearInterval(intervalId);
      }, 2000);
    },
    submitResource() {
      this.resourceSubmitted = true;
      const intervalId = setTimeout(() => {
        this.resourceSubmitted = false;
        this.resource = false;
        clearInterval(intervalId);
      }, 2000);
    },
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
          }, 2000);
        })
        .catch((err) => {
          // This can happen if the user denies clipboard permissions:
          // eslint-disable-next-line
          console.error('Could not copy text: ', err);
        });
    },
    feedbackCB() {
      this.feedback = true;
    },
    resourceCB() {
      this.resource = true;
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
  color:#d12335 !important;
  text-decoration: none;
}

a:link {
  color:#d12335 !important;
  text-decoration: none;
}

</style>
