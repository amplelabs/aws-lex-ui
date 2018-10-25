<template>
  <v-toolbar style="background-color:#D12335"
    app
    dense
    fixed
  >
    <img v-if="toolbarLogo" v-bind:src="toolbarLogo">
    <v-toolbar-title class="hidden-xs-and-down">
      <span class="white--text">{{ toolbarTitle }}</span>
    </v-toolbar-title>
    <v-spacer />
    <!-- tooltip should be before btn to avoid right margin issue in mobile -->
    <v-tooltip
      v-model="shouldShowTooltip"
      activator=".min-max-toggle"
      left
    >
      <span id="min-max-tooltip">{{toolTipMinimize}}</span>
    </v-tooltip>
    <v-btn icon
      @click="shareCB"
    >
      <span style="color:#ffffff"></span><v-icon color="white">
        open_in_new
      </v-icon> <span style="color:#D12335"></span>
    </v-btn>
    <v-dialog
      v-model="dialog"
      max-width="350"
    >
      <v-card>
        <v-container grid-list-md text-xs-center>
          <v-layout row wrap v-if="!shareConfirm">
            <v-flex xs11>
            <v-card-title class="subheading">Share this bot: </v-card-title>
            </v-flex>
            <v-flex xs1>
              <v-icon @click="dialog = false">close</v-icon>
            </v-flex>
            <!-- v-card-text id="url">{{ url }}</v-card-text -->
            <v-text-field
              v-model="url"
            ></v-text-field>
          <v-card-actions>
            <v-btn
              color="amber lighten-1"
              depressed
              @click="copyToClipboard"
            >
              Copy URL
            </v-btn>
          </v-card-actions>
          </v-layout>
          <v-layout row wrap v-else>
            <v-flex offset-xs2>
              <v-card-text>Link Copied</v-card-text>
            </v-flex>
            <v-flex xs4>
              <v-btn fab small color="amber lighten-1">
                <v-icon color="white">check</v-icon>
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
      url: 'https://amplebot-3d467.firebaseapp.com/#/',
      dialog: false,
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

<style>
.cg {
  background-color: #D12335;
}
</style>
