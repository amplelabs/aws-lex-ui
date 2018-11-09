<template>
  <v-card flat class="grey lighten-4">
    <v-container pa-0 grid-list-md >
      <v-layout justify-start row fill-height wrap>
        <v-flex v-bind:class="flexClass" fluid>
          <!--v-card-title v-if="responseCard.title.trim()" class="grey lighten-4">
            <span class="caption">{{responseCard.title}}</span>
          </v-card-title>
          <v-card-text v-if="responseCard.subTitle">
            <span>{{responseCard.subTitle}}</span>
          </v-card-text height="33vh"-->
          <v-card-media
            v-if="responseCard.imageUrl !== null"
            :src="imageUrl"
            contain
            height="23vh"
          ></v-card-media>
        </v-flex>
        <v-container class="cgbuttonrow">
          <!-- v-layout justify-start row nowrap>
            <v-flex xs12 v-if="responseCard.attachmentLinkUrl && displayLinkCaption()">
            <v-card-actions ml-2>
              <v-btn
                class="cgred"
                round outline small
                tag="a"
                v-bind:href="responseCard.attachmentLinkUrl"
                target="_blank"
              >
                {{ responseCard.subTitle }} <v-icon style="margin-left:0.0em; font-size: 14px;" right dark>call_made</v-icon>
              </v-btn>
            </v-card-actions>
            </v-flex>
          </v-layout -->
          <v-layout justify-start row wrap>
            <!-- -->
            <v-card-actions
              style="margin-top:8px;"
              ml-2 v-if="responseCard.attachmentLinkUrl && displayLinkCaption()">
              <v-btn
                class="cgred"
                round outline small
                tag="a"
                v-bind:href="responseCard.attachmentLinkUrl"
                target="_blank"
              >
                {{ responseCard.subTitle }} <v-icon style="margin-left:0.0em; font-size: 14px;" right dark>call_made</v-icon>
              </v-btn>
            </v-card-actions>
            <!-- -->
            <v-card-actions
              ml-2 
              v-for="(button, index) in responseCard.buttons"
              v-bind:key="index"
              actions
              class="button-row"
            > <!-- button.value -->
              <v-btn
                v-if="button.text && button.value && !hasButtonBeenClicked"
                v-on:click.once.native="onButtonClick(button.text)"
                v-bind:disabled="hasButtonBeenClicked"
                class="cgred"
                round outline small
              >
                {{button.text}}
              </v-btn> 
            </v-card-actions>
          </v-layout>
        </v-container>
     </v-layout>
    </v-container>
  </v-card>
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
    imageUrl() {
      return `'${this.responseCard.imageUrl}'`;
    },
    flexClass() {
      // console.log(this.$vuetify.breakpoint.name);
      // console.log(this.$vuetify.breakpoint.mdAndUp);
      return {
        xs12: !this.$vuetify.breakpoint.mdAndUp,
        xs6: this.$vuetify.breakpoint.mdAndUp,
      };
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
    // console.log(this.responseCard.subTitle);
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
  justify-content: center;
  padding-bottom: 0em;
  margin-bottom: 0px;
}

.cgred {
  color: #d12335;
  margin: 0.25em 0 0;
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
  margin-top: -2em;
  margin-left: 0.5em;
  overflow-x: auto;
}

.linkbutton {
  /* margin-top:-1em; */
  margin-bottom: -1.5em;
  /* padding-bottom: 0.5em; */
}
</style>
