<template>
  <v-container class="cgbuttonrow" grid-list-md >
    <v-img
      v-if="responseCard.imageUrl !== null"
      :src="imageUrl"
      :height="mapHeight"
      width="80wh"
      :style="mapOffset"
    ></v-img>
    <v-layout row wrap>
      <v-card-actions
        v-if="responseCard.attachmentLinkUrl && displayLinkCaption()">
        <v-btn
          class="cgred"
          :style="styleAdj"
          round outline small
          tag="a"
          v-bind:href="responseCard.attachmentLinkUrl"
          target="_blank"
        >
          {{ responseCard.subTitle }}
        </v-btn>
      </v-card-actions>
      <v-card-actions
        v-for="(button, index) in responseCard.buttons"
        v-bind:key="index"
        actions
        class="button-row"
        >
        <v-btn
          v-if="button.text && button.value && !hasButtonBeenClicked"
          v-on:click.once.native="onButtonClick(button.text)"
          v-bind:disabled="hasButtonBeenClicked"
          class="cgred"
          :style="styleAdj"
          round outline small
        >
          {{button.text}}
        </v-btn> 
      </v-card-actions>
    </v-layout>
  </v-container>
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
  name: 'response-card',
  props: ['response-card'],
  data() {
    return {
      subTitle: null,
      hasButtonBeenClicked: false,
    };
  },
  computed: {
    mapOffset() {
      return 'margin-left:10px;';
    },
    mapHeight() {
      if (this.$vuetify.breakpoint.mdAndUp) return '400px';
      if (this.$vuetify.breakpoint.smAndUp) return '300px';
      return '23vh';
    },
    styleAdj() {
      return 'margin-left:10px';
    },
    imageUrl() {
      return `${this.responseCard.imageUrl}`;
    },
  },
  methods: {
    displayLinkCaption() {
      if (this.subTitle === null
        || this.subTitle === undefined
        || typeof (this.subTitle) !== 'string') {
        return false;
      }
      const len = this.subTitle.length;
      // eslint-disable-next-line
      return len === 0 ? false : true;
    },
    getUrl(c) {
      return c.imageUrl;
    },
    onButtonClick(value) {
      this.hasButtonBeenClicked = true;
      const message = {
        type: 'human',
        text: value,
      };

      this.$store.dispatch('postTextMessage', message);
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.subTitle = this.responseCard.subTitle;
  },
};
</script>

<style scoped>
.card {
  width: 75vw;
  height: 100%;
  position: inherit; /* workaround to card being displayed on top of toolbar shadow */
  padding-bottom: 0em;
}
.card__title {
  padding: 0em;
  padding-top: 0em;
}
.card__text {
  padding: 0.33em;
}
.card__actions {
  padding-bottom: 0px !important;
}
.card__actions.button-row {
  justify-content: left;
  padding-bottom: 0em;
  margin-bottom: 0px;
}

.cgred {
  color: #d12335;
  margin: 0.25em 0 0 0;
  text-transform: capitalize;
  font-size: 16px;
  height: 3em;
  padding: 0 0.5em;
}

.container {
  padding: 2vh 1.5vh;
  text-transform: capitalize;
}

.cgbuttonrow {
  margin-top: -20px;
  margin-left: 0px;
  overflow-x: auto;
}

.linkbutton {
  margin-bottom: -1.5em;
}

a {
  color:#d12335 !important;
  text-decoration: none;
}

a:link {
  color:#d12335 !important;
  text-decoration: none;
}

a[href^="tel:"] {
  color: black !important;
  text-decoration: underline;
}

.v-btn {
  min-width: 120px;
  height: 40px;
}

</style>