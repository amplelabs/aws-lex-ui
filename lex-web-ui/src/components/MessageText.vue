<template>
  <div
    v-if="message.text && message.type === 'human'"
    class="message-text"
  >
    {{ message.text }}
  </div>
  <div
    v-else-if="altHtmlMessage && AllowSuperDangerousHTMLInMessage"
    v-html="altHtmlMessage"
    class="message-text"
  ></div>
  <!-- div
    v-else-if="message.text && shouldRenderAsHtml"
    v-html="botMessageAsHtml"
    class="message-text"
  ></div -->
  <div
    v-else-if="message.text && message.type === 'bot'"
    class="message-text"
  >
    <span v-html="message.text"></span>
  </div>
  <div
    v-else-if="message.type === 'pondering' && loading"
    class=""
  >
    <!-- Pondering></Pondering -->
    <div class="lds-css ng-scope">
      <div class="lds-message" style="100%;height:100%"> 
        <div></div><div></div><div></div>
      </div>
    </div>
  </div>
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

import Pondering from '@/components/Pondering';

const marked = require('marked');

const renderer = new marked.Renderer();

renderer.link = function link(href, title, text) {
  return `<a href="${href}" title="${title}" target="_blank">${text}</a>`;
};

export default {
  name: 'message-text',
  props: ['message'],
  components: {
    Pondering,
  },
  computed: {
    loading() {
      return this.$store.state.lex.isProcessing;
    },
    shouldConvertUrlToLinks() {
      // eslint-disable-next-line
      // console.log(this.message.text);
      return true; // this.$store.state.config.ui.convertUrlToLinksInBotMessages;
    },
    shouldStripTags() {
      return false; // this.$store.state.config.ui.stripTagsFromBotMessages;
    },
    AllowSuperDangerousHTMLInMessage() {
      return true; // this.$store.state.config.ui.AllowSuperDangerousHTMLInMessage;
    },
    altHtmlMessage() {
      let out = false;
      if (this.message.alts) {
        if (this.message.alts.html) {
          out = this.message.alts.html;
        } else if (this.message.alts.markdown) {
          out = marked(this.message.alts.markdown, { renderer });
        }
      }
      return out;
    },
    shouldRenderAsHtml() {
      return ((this.message.type === 'bot' || (this.message.type === 'pondering'))
      && this.shouldConvertUrlToLinks);
    },
    botMessageAsHtml() {
      // Security Note: Make sure that the content is escaped according
      // to context (e.g. URL, HTML). This is rendered as HTML
      const messageText = this.message.text; // this.stripTagsFromMessage(this.message.text);
      const messageWithLinks = this.botMessageWithLinks(messageText);
      return messageWithLinks;
      // return 'rawHtml';
    },
  },
  methods: {
    encodeAsHtml(value) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
    botMessageWithLinks(messageText) {
      const linkReplacers = [
        // The regex in the objects of linkReplacers should return a single
        // reference (from parenthesis) with the whole address
        // The replace function takes a matched url and returns the
        // hyperlink that will be replaced in the message
        {
          type: 'web',
          regex: new RegExp(
            '\\b((?:https?://\\w{1}|www\\.)(?:[\\w-.]){2,256}' +
            '(?:[\\w._~:/?#@!$&()*+,;=[\'\\]-]){0,256})',
            'im',
          ),
          replace: (item) => {
            const url = (!/^https?:\/\//.test(item)) ? `http://${item}` : item;
            return '<a target="_blank" ' +
              `href="${encodeURI(url)}">${this.encodeAsHtml(item)}</a>`;
          },
        },
      ];
      // TODO avoid double HTML encoding when there's more than 1 linkReplacer
      return linkReplacers
        .reduce(
          (message, replacer) =>
            // splits the message into an array containing content chunks
            // and links. Content chunks will be the even indexed items in the
            // array (or empty string when applicable).
            // Links (if any) will be the odd members of the array since the
            // regex keeps references.
            message.split(replacer.regex)
              .reduce(
                (messageAccum, item, index, array) => {
                  let messageResult = '';
                  if ((index % 2) === 0) {
                    const urlItem = ((index + 1) === array.length) ?
                      '' : replacer.replace(array[index + 1]);
                    messageResult = `${this.encodeAsHtml(item)}${urlItem}`;
                  }
                  return messageAccum + messageResult;
                },
                '',
              ),
          messageText,
        );
    },
    // used for stripping SSML (and other) tags from bot responses
    stripTagsFromMessage(messageText) {
      const doc = document.implementation.createHTMLDocument('').body;
      doc.innerHTML = messageText;
      return doc.textContent || doc.innerText || '';
    },
  },
};
</script>

<style scoped>
.message-text {
  hyphens: auto;
  overflow-wrap: break-word;
  padding: 0.8em;
  white-space: normal;
  word-break: break-word;
}

.pondering-text {
  background-color: aquamarine
}

@keyframes lds-message {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
}
@keyframes lds-message {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
}
@-webkit-keyframes lds-message {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
}
.lds-message {
  position: relative;
}
.lds-message > div {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  top: 84px;
  -webkit-animation: lds-message 1s cubic-bezier(0.3, 0, 0.7, 1) infinite;
  animation: lds-message 1s cubic-bezier(0.3, 0, 0.7, 1) infinite;
}
.lds-message > div:nth-of-type(4n + 1) {
  background: #e69090;
}
.lds-message > div:nth-of-type(4n + 2) {
  background: #de5d5d;
}
.lds-message > div:nth-of-type(4n + 3) {
  background: #cf2525;
}
.lds-message > div:nth-of-type(4n) {
  background: #d3e6ea;
}
.lds-message > div:nth-of-type(4n + 1) {
  left: 34px;
  -webkit-animation-delay: -0.666666666666667s;
  animation-delay: -0.666666666666667s;
}
.lds-message > div:nth-of-type(4n + 2) {
  left: 84px;
  -webkit-animation-delay: -0.333333333333333s;
  animation-delay: -0.333333333333333s;
}
.lds-message > div:nth-of-type(4n + 3) {
  left: 134px;
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
.lds-message {
  width: 60px !important;
  height: 60px !important;
  -webkit-transform: translate(-30px, -30px) scale(0.3) translate(30px, 30px);
  transform: translate(-30px, -30px) scale(0.3) translate(30px, 30px);
}
</style>
