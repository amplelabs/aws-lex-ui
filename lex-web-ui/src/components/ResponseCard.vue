<template>
  <v-card flat class="grey lighten-4">
    <v-container ml-4 pa-0 grid-list-md text-xs-center>
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
          <v-layout justify-start row nowrap>
            <v-flex xs12 v-if="responseCard.attachmentLinkUrl && displayLinkCaption()">
            <v-card-actions>
              <v-btn
                class="linkbutton"
                flat small color="grey darken-3"
                tag="a"
                v-bind:href="responseCard.attachmentLinkUrl"
                target="_blank"
              >
                {{ responseCard.subTitle }} <v-icon right dark>call_made</v-icon>
              </v-btn>
            </v-card-actions>
            </v-flex>
          </v-layout>
          <v-layout justify-start row wrap>
            <v-card-actions
              ml-2 
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
  padding-bottom: 0.0em;
}
.card__title {
  padding: 0.0em;
  padding-top: 0.0em;
}
.card__text {
  padding: 0.33em;
}
.card__actions.button-row {
  justify-content: center;
  padding-bottom: 0.0em;
  margin-bottom: 0px;
}
.cgred {
  color: #D12335;
  margin-top: -2px;
  margin-right: -5px;
  text-transform: capitalize;
}

.cgbuttonrow {
  margin-top:-1em;
  margin-left:-1em;
  overflow-x: auto;
}

.linkbutton {
  margin-top:-1em;
  margin-bottom:-1em;
  padding-bottom: 0.5em; 
}

</style>
