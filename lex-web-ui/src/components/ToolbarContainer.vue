<template>
  <v-toolbar style="background-color:#D12335"
    app
    dense
    flat
    fixed
  >
    <img width="40" style="margin-left:-12px; padding-left:12px; padding-top:9px; padding-bottom:9px"
      v-if="toolbarLogo" v-bind:src="toolbarLogo" @click="restartCB">
    <v-toolbar-title ma-0 pa-0 class="hidden-xs-and-down" @click="restartCB">
      <a href=""><span class="white--text" flat
      style="font-size:18px; font-weight: bold; background:#d12335; margin-left:-1px; "
      >{{ toolbarTitle }}</span></a>
    </v-toolbar-title>
    <v-spacer />
    <!-- tooltip should be before btn to avoid right margin issue in mobile -->
    <v-tooltip
      v-model="shouldShowTooltip"
      activator=".min-max-toggle"
      left
    >
    </v-tooltip>
    <v-btn icon
      style="margin-right:-1.4em; padding-left:-12px"
      @click="resourceCB"
    >
      <v-icon color="white">
        add_circle
      </v-icon> <span style="color:#D12335"></span>
    </v-btn>
    <v-dialog
      v-model="resource"
      max-width="400"
    >
      <v-toolbar
        style="background-color:#D12335"
        dense
      >
        <v-toolbar-title class="white--text">Add a new resource</v-toolbar-title>
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
              v-model="org_name"
              placeholder="Organization Name"
              style="margin-top: -30px;"
              color="#d12335"
              outline
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Organization address</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-textarea
              v-model="org_address"
              placeholder="Address"
              style="margin-top: -30px"
              color="#d12335"
              outline
              maxlength="50"
            ></v-textarea>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Website</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              v-model="www"
              placeholder="http://"
              style="margin-top: -30px"
              color="#d12335"
              outline
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Phone Number</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              v-model="org_phone"
              placeholder="Phone Number"
              style="margin-top: -30px"
              color="#d12335"
              outline
              maxlength="30"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Name of service</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              v-model="service"
              placeholder="e.g. meals, shelter"
              style="margin-top: -30px"
              color="#d12335"
              outline
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Service Description</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              v-model="desc"
              style="margin-top: -30px"
              color="#d12335"
              outline
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Days served</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              v-model="days"
              placeholder="Monday, Tuesday, etc."
              style="margin-top: -30px"
              color="#d12335"
              outline
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Times served</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              v-model="times"
              placeholder="1pm - 3pm, etc."
              style="margin-top: -30px"
              color="#d12335"
              outline
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Who is eligible?</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              v-model="eligibility"
              placeholder="e.g. ages, gender(s)"
              style="margin-top: -30px"
              color="#d12335"
              outline
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Additional notes</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="notes"
                style="margin-top: -30px"
                outline
                color="#d12335"
                name="input-7-4"
              ></v-textarea>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Contact Name</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              v-model="contact_name"
              style="margin-top: -30px"
              color="#d12335"
              outline
              maxlength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-card-text style="margin: -30px 0 0 -15px;">Contact Email</v-card-text>
            </v-flex>
            <v-flex xs12>
              <v-text-field
              v-model="contact_email"
              style="margin-top: -30px"
              color="#d12335"
              outline
              maxlength="50"
            ></v-text-field>
            </v-flex>
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
      @click="feedbackCB"
    >
      <v-icon color="white">
        feedback
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

import axios from 'axios';
import uuid from 'uuid';
// require('dotenv').config({ path: '../.env' })

export default {
  name: 'toolbar-container',
  data() {
    return {
      url: 'https://chalmersbot.amplelabs.co',
      resource: false,
      shareConfirm: false,
      resourceSubmitted: false,
      shouldShowTooltip: false,
      tooltipEventHandlers: {
        mouseenter: this.onInputButtonHoverEnter,
        mouseleave: this.onInputButtonHoverLeave,
        touchstart: this.onInputButtonHoverEnter,
        touchend: this.onInputButtonHoverLeave,
        touchcancel: this.onInputButtonHoverLeave,
      },
      org_name: null,
      org_address: null,
      org_phone: null,
      www: null,
      email: null,
      service: null,
      desc: null,
      days: null,
      times: null,
      eligibility: null,
      notes: null,
      contact_name: null,
      contact_email: null,
      // for feedback from, moved from inputContainer
      feedback: false,
      feedbackSubmitted: false,
      nameInput: null,
      feedbackInput: null,
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
      // eslint-disable-next-line
      const postUrl = process.env.VUE_APP_CREATE_URL;
      const item = {
        id: uuid.v1(),
        name: this.nameInput === null || this.nameInput.length === 0 ? 'na' : this.nameInput,
        feedback: this.feedbackInput === null || this.feedbackInput.length === 0 ?
          'na' : this.feedbackInput,
      };
      // eslint-disable-next-line
      axios.post(postUrl, item, {
        headers: {
          'x-api-key': process.env.VUE_APP_API_KEY_VALUE,
        },
      })
        .then((resp) => {
          // eslint-disable-next-line
          console.log(resp.status);
          this.feedbackSubmitted = false;
          this.feedback = false;
        })
        .catch((err) => {
          // eslint-disable-next-line
          console.error(err);
        });
    },
    feedbackCB() {
      this.feedback = true;
    },
    restartCB() {
      window.location.reload();
    },
    clearForm() {
      this.org_name = null;
      this.org_address = null;
      this.org_phone = null;
      this.www = null;
      this.email = null;
      this.service = null;
      this.desc = null;
      this.days = null;
      this.times = null;
      this.eligibility = null;
      this.notes = null;
      this.contact_name = null;
      this.contact_email = null;
    },
    submitResource() {
      this.resourceSubmitted = true;
      // eslint-disable-next-line
      const postUrl = process.env.VUE_APP_API_KEY_VALUE;
      const item = {
        id: uuid.v1(),
        org_name: this.org_name === null || this.org_name.length === 0 ? 'na' : this.org_name,
        org_address: this.org_address === null || this.org_address.length === 0 ? 'na' : this.org_address,
        org_phone: this.org_phone === null || this.org_phone.length === 0 ? 'na' : this.org_phone,
        www: this.www === null || this.www.length === 0 ? 'na' : this.www,
        email: this.email === null || this.email.length === 0 ? 'na' : this.email,
        service: this.service === null || this.service.length === 0 ? 'na' : this.service,
        desc: this.desc === null || this.desc.length === 0 ? 'na' : this.desc,
        days: this.days === null || this.days.length === 0 ? 'na' : this.days,
        times: this.times === null || this.times.length === 0 ? 'na' : this.times,
        eligibility: this.eligibility === null || this.eligibility.length === 0 ? 'na' : this.eligibility,
        notes: this.notes === null || this.notes.length === 0 ? 'na' : this.notes,
        contact_name: this.contact_name === null || this.contact_name.length === 0 ? 'na' : this.contact_name,
        contact_email: this.contact_email === null || this.contact_email.length === 0 ? 'na' : this.contact_email,
      };
      // eslint-disable-next-line
      console.log(item);
      axios.post(postUrl, item, {
        headers: {
          'x-api-key': process.env.VUE_APP_API_KEY_RES_VALUE,
        },
      })
        .then((resp) => {
          // eslint-disable-next-line
          console.log(resp.status);
          this.resourceSubmitted = false;
          this.resource = false;
          this.clearForm();
        })
        .catch((err) => {
          this.resourceSubmitted = false;
          this.resource = false;
          this.clearForm();
          // eslint-disable-next-line
          console.error(err);
        });
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