/*
Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file
except in compliance with the License. A copy of the License is located at

http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed on an "AS IS"
BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the
License for the specific language governing permissions and limitations under the License.
*/

/**
 * Asynchronous store actions
 */

/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
/* eslint spaced-comment: ["error", "always", { "exceptions": ["*"] }] */

import axios from 'axios';

import LexAudioRecorder from '@/lib/lex/recorder';
import initRecorderHandlers from '@/store/recorder-handlers';
import silentOgg from '@/assets/silent.ogg';
import silentMp3 from '@/assets/silent.mp3';

import LexClient from '@/lib/lex/client';

const dashBotURL = 'https://tracker.dashbot.io/track?platform=universal&v=10.1.1-rest';
const dashBotAPI = process.env.DASHBOT_KEY || '';
const dashBotIncomingURL = `${dashBotURL}&type=incoming&apiKey=${dashBotAPI}`;
const dashBotOutcomingURL = `${dashBotURL}&type=outgoing&apiKey=${dashBotAPI}`;

// non-state variables that may be mutated outside of store
// set via initializers at run time
let awsCredentials;
let pollyClient;
let lexClient;
let audio;
let recorder;

export default {

  /***********************************************************************
   *
   * Initialization Actions
   *
   **********************************************************************/

  initCredentials(context, credentials) {
    switch (context.state.awsCreds.provider) {
      case 'cognito':
        awsCredentials = credentials;
        return context.dispatch('getCredentials');
      case 'parentWindow':
        return context.dispatch('getCredentials');
      default:
        return Promise.reject(new Error('unknown credential provider'));
    }
  },
  getConfigFromParent(context) {
    if (!context.state.isRunningEmbedded) {
      return Promise.resolve({});
    }

    return context.dispatch(
      'sendMessageToParentWindow',
      { event: 'initIframeConfig' },
    )
      .then((configResponse) => {
        if (configResponse.event === 'resolve' &&
            configResponse.type === 'initIframeConfig') {
          return Promise.resolve(configResponse.data);
        }
        return Promise.reject(new Error('invalid config event from parent'));
      });
  },
  initConfig(context, configObj) {
    context.commit('mergeConfig', configObj);
  },
  initMessageList(context) {
    context.dispatch('directMessage', {
      type: 'human',
      text: 'hi',
    });
  },
  initLexClient(context, lexRuntimeClient) {
    lexClient = new LexClient({
      botName: context.state.config.lex.botName,
      botAlias: context.state.config.lex.botAlias,
      lexRuntimeClient,
    });

    context.commit(
      'setLexSessionAttributes',
      context.state.config.lex.sessionAttributes,
    );
    return context.dispatch('getCredentials')
      .then(() => lexClient.initCredentials(awsCredentials));
  },
  initPollyClient(context, client) {
    if (!context.state.recState.isRecorderEnabled) {
      return Promise.resolve();
    }
    pollyClient = client;
    context.commit('setPollyVoiceId', context.state.config.polly.voiceId);
    return context.dispatch('getCredentials')
      .then((creds) => {
        pollyClient.config.credentials = creds;
      });
  },
  initRecorder(context) {
    if (!context.state.config.recorder.enable) {
      context.commit('setIsRecorderEnabled', false);
      return Promise.resolve();
    }
    recorder = new LexAudioRecorder(context.state.config.recorder);

    return recorder.init()
      .then(() => recorder.initOptions(context.state.config.recorder))
      .then(() => initRecorderHandlers(context, recorder))
      .then(() => context.commit('setIsRecorderSupported', true))
      .then(() => context.commit('setIsMicMuted', recorder.isMicMuted))
      .catch((error) => {
        if (['PermissionDeniedError', 'NotAllowedError'].indexOf(error.name)
            >= 0) {
          console.warn('get user media permission denied');
          context.dispatch(
            'pushErrorMessage',
            'It seems like the microphone access has been denied. ' +
            'If you want to use voice, please allow mic usage in your browser.',
          );
        } else {
          console.error('error while initRecorder', error);
        }
      });
  },
  initBotAudio(context, audioElement) {
    if (!context.state.recState.isRecorderEnabled ||
        !context.state.config.recorder.enable
    ) {
      return Promise.resolve();
    }
    if (!audioElement) {
      return Promise.reject(new Error('invalid audio element'));
    }
    audio = audioElement;

    let silentSound;

    // Ogg is the preferred format as it seems to be generally smaller.
    // Detect if ogg is supported (MS Edge doesn't).
    // Can't default to mp3 as it is not supported by some Android browsers
    if (audio.canPlayType('audio/ogg') !== '') {
      context.commit('setAudioContentType', 'ogg');
      silentSound = silentOgg;
    } else if (audio.canPlayType('audio/mp3') !== '') {
      context.commit('setAudioContentType', 'mp3');
      silentSound = silentMp3;
    } else {
      console.error('init audio could not find supportted audio type');
      console.warn(
        'init audio can play mp3 [%s]',
        audio.canPlayType('audio/mp3'),
      );
      console.warn(
        'init audio can play ogg [%s]',
        audio.canPlayType('audio/ogg'),
      );
    }

    console.info('recorder content types: %s', recorder.mimeType);

    audio.preload = 'auto';
    // Load a silent sound as the initial audio. This is used to workaround
    // the requirement of mobile browsers that would only play a
    // sound in direct response to a user action (e.g. click).
    // This audio should be explicitly played as a response to a click
    // in the UI
    audio.src = silentSound;
    // autoplay will be set as a response to a clik
    audio.autoplay = false;

    return Promise.resolve();
  },
  reInitBot(context) {
    return Promise.resolve()
      .then(() => (
        (context.state.config.ui.pushInitialTextOnRestart) ?
          context.dispatch('directMessage', {
            type: 'human',
            text: 'hi',
          }) :
          Promise.resolve()
      ))
      .then(() => (
        (context.state.config.lex.reInitSessionAttributesOnRestart) ?
          context.commit(
            'setLexSessionAttributes',
            context.state.config.lex.sessionAttributes,
          ) :
          Promise.resolve()
      ));
  },

  /***********************************************************************
   *
   * Audio Actions
   *
   **********************************************************************/

  getAudioUrl(context, blob) {
    let url;

    try {
      url = URL.createObjectURL(blob);
    } catch (err) {
      console.error('getAudioUrl createObjectURL error', err);
      const errorMessage = 'There was an error processing the audio ' +
        `response: (${err})`;
      const error = new Error(errorMessage);
      return Promise.reject(error);
    }

    return Promise.resolve(url);
  },
  setAudioAutoPlay(context) {
    if (audio.autoplay) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      audio.play();
      // eslint-disable-next-line no-param-reassign
      audio.onended = () => {
        context.commit('setAudioAutoPlay', { audio, status: true });
        resolve();
      };
      // eslint-disable-next-line no-param-reassign
      audio.onerror = (err) => {
        context.commit('setAudioAutoPlay', { audio, status: false });
        reject(new Error(`setting audio autoplay failed: ${err}`));
      };
    });
  },
  playAudio(context, url) {
    return new Promise((resolve) => {
      audio.onloadedmetadata = () => {
        context.commit('setIsBotSpeaking', true);
        context.dispatch('playAudioHandler')
          .then(() => resolve());
      };
      audio.src = url;
    });
  },
  playAudioHandler(context) {
    return new Promise((resolve, reject) => {
      const { enablePlaybackInterrupt } = context.state.config.lex;

      const clearPlayback = () => {
        context.commit('setIsBotSpeaking', false);
        const intervalId = context.state.botAudio.interruptIntervalId;
        if (intervalId && enablePlaybackInterrupt) {
          clearInterval(intervalId);
          context.commit('setBotPlaybackInterruptIntervalId', 0);
          context.commit('setIsLexInterrupting', false);
          context.commit('setCanInterruptBotPlayback', false);
          context.commit('setIsBotPlaybackInterrupting', false);
        }
      };

      audio.onerror = (error) => {
        clearPlayback();
        reject(new Error(`There was an error playing the response (${error})`));
      };
      audio.onended = () => {
        clearPlayback();
        resolve();
      };
      audio.onpause = audio.onended;

      if (enablePlaybackInterrupt) {
        context.dispatch('playAudioInterruptHandler');
      }
    });
  },
  playAudioInterruptHandler(context) {
    const { isSpeaking } = context.state.botAudio;
    const {
      enablePlaybackInterrupt,
      playbackInterruptMinDuration,
      playbackInterruptVolumeThreshold,
      playbackInterruptLevelThreshold,
      playbackInterruptNoiseThreshold,
    } = context.state.config.lex;
    const intervalTimeInMs = 200;

    if (!enablePlaybackInterrupt &&
        !isSpeaking &&
        context.state.lex.isInterrupting &&
        audio.duration < playbackInterruptMinDuration
    ) {
      return;
    }

    const intervalId = setInterval(() => {
      const { duration } = audio;
      const end = audio.played.end(0);
      const { canInterrupt } = context.state.botAudio;

      if (!canInterrupt &&
          // allow to be interrupt free in the beginning
          end > playbackInterruptMinDuration &&
          // don't interrupt towards the end
          (duration - end) > 0.5 &&
          // only interrupt if the volume seems to be low noise
          recorder.volume.max < playbackInterruptNoiseThreshold
      ) {
        context.commit('setCanInterruptBotPlayback', true);
      } else if (canInterrupt && (duration - end) < 0.5) {
        context.commit('setCanInterruptBotPlayback', false);
      }

      if (canInterrupt &&
          recorder.volume.max > playbackInterruptVolumeThreshold &&
          recorder.volume.slow > playbackInterruptLevelThreshold
      ) {
        clearInterval(intervalId);
        context.commit('setIsBotPlaybackInterrupting', true);
        setTimeout(() => {
          audio.pause();
        }, 500);
      }
    }, intervalTimeInMs);

    context.commit('setBotPlaybackInterruptIntervalId', intervalId);
  },
  getAudioProperties() {
    return (audio) ?
      {
        currentTime: audio.currentTime,
        duration: audio.duration,
        end: (audio.played.length >= 1) ?
          audio.played.end(0) : audio.duration,
        ended: audio.ended,
        paused: audio.paused,
      } :
      {};
  },

  /***********************************************************************
   *
   * Recorder Actions
   *
   **********************************************************************/

  startConversation(context) {
    context.commit('setIsConversationGoing', true);
    return context.dispatch('startRecording');
  },
  stopConversation(context) {
    context.commit('setIsConversationGoing', false);
  },
  startRecording(context) {
    // don't record if muted
    if (context.state.recState.isMicMuted === true) {
      console.warn('recording while muted');
      context.dispatch('stopConversation');
      return Promise.reject(new Error('The microphone seems to be muted.'));
    }

    context.commit('startRecording', recorder);
    return Promise.resolve();
  },
  stopRecording(context) {
    context.commit('stopRecording', recorder);
  },
  getRecorderVolume(context) {
    if (!context.state.recState.isRecorderEnabled) {
      return Promise.resolve();
    }
    return recorder.volume;
  },

  /***********************************************************************
   *
   * Lex and Polly Actions
   *
   **********************************************************************/

  pollyGetBlob(context, text, format = 'text') {
    const synthReq = pollyClient.synthesizeSpeech({
      Text: text,
      VoiceId: context.state.polly.voiceId,
      OutputFormat: context.state.polly.outputFormat,
      TextType: format,
    });
    return context.dispatch('getCredentials')
      .then(() => synthReq.promise())
      .then((data) => {
        const blob = new Blob([data.AudioStream], { type: data.ContentType });
        return Promise.resolve(blob);
      });
  },
  pollySynthesizeSpeech(context, text, format = 'text') {
    return context.dispatch('pollyGetBlob', text, format)
      .then(blob => context.dispatch('getAudioUrl', blob))
      .then(audioUrl => context.dispatch('playAudio', audioUrl));
  },
  interruptSpeechConversation(context) {
    if (!context.state.recState.isConversationGoing &&
        !context.state.botAudio.isSpeaking
    ) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      context.dispatch('stopConversation')
        .then(() => context.dispatch('stopRecording'))
        .then(() => {
          if (context.state.botAudio.isSpeaking) {
            audio.pause();
          }
        })
        .then(() => {
          let count = 0;
          const countMax = 20;
          const intervalTimeInMs = 250;
          context.commit('setIsLexInterrupting', true);
          const intervalId = setInterval(() => {
            if (!context.state.lex.isProcessing) {
              clearInterval(intervalId);
              context.commit('setIsLexInterrupting', false);
              resolve();
            }
            if (count > countMax) {
              clearInterval(intervalId);
              context.commit('setIsLexInterrupting', false);
              reject(new Error('interrupt interval exceeded'));
            }
            count += 1;
          }, intervalTimeInMs);
        });
    });
  },
  ponderingChat(context) {
    context.dispatch('pushMessage', {
      text: 'testing',
      type: 'pondering',
    });
  },
  // async dummyChat(context, txt, index) {
  async dummyChat(context, arg) {
    const txt = arg[0];
    const index = arg[1];
    const intervalTimeInMs = 2800 * (index + 1);
    // eslint-disable-next-line
    // console.log(index);
    return new Promise((resolve) => {
      // context.commit('setIsLexProcessing', true);
      const intervalId = setTimeout(() => {
        clearInterval(intervalId);
        context.commit('setIsLexProcessing', false);
        context.commit('popMessage');
        context.dispatch('pushMessage', {
          text: txt,
          type: 'bot',
        });
        context.commit('setIsLexProcessing', true);
        context.dispatch('ponderingChat'); // ponderingChat();
        resolve(txt);
      }, intervalTimeInMs);
    });
  },
  processResponse(context, response) {
    if (response.message.match('##MAPINFO') !== null) {
      // context.dispatch('directMessage', {
      //   type: 'human',
      //   text: 'hi',
      //   // });
      const tmp = response.message.slice(10).split('##');
      const mealJson = JSON.parse(tmp[0]);
      context.commit('setMealJson', mealJson);
      console.log(mealJson); // eslint-disable-line
      response.message = tmp.slice(1).join('##'); // eslint-disable-line
      //   return;
    }
    if (response.message.match('##restart') !== null) {
      context.dispatch('directMessage', {
        type: 'human',
        text: 'hi',
      });
      return;
    }
    if (response.message.match('##error') !== null) {
      context.dispatch('directMessage', {
        type: 'human',
        text: 'error',
      });
      return;
    }
    const arr = response.message.split(' ## ');
    const intervalTimeInMs = 1000;
    context.commit('setIsLexProcessing', true);
    context.dispatch('ponderingChat'); // ponderingChat();
    const intervalId = setInterval(async () => {
      clearInterval(intervalId);
      context.commit('setIsLexProcessing', false);
      context.commit('popMessage');
      // eslint-disable-next-line
      // console.log(response.message);
      if (arr.length === 1) {
        context.dispatch(
          'pushMessage',
          {
            text: response.message,
            type: 'bot',
            dialogState: context.state.lex.dialogState,
            responseCard: context.state.lex.responseCard,
            alts: JSON.parse(response.sessionAttributes.appContext || '{}').altMessages,
          },
        );
        context.commit('setBotIsTexting', false);
      } else {
        // start the ... first.
        context.commit('setIsLexProcessing', true);
        context.dispatch('ponderingChat');
        await Promise.all(arr
          .map(async (x, index) => context.dispatch('dummyChat', [x, index])));
        context.commit('setIsLexProcessing', false);
        context.commit('setBotIsTexting', false);
        context.commit('popMessage');
        context.dispatch(
          'pushMessage',
          {
            text: '', // txt, // response.message,
            type: '',
            dialogState: context.state.lex.dialogState,
            responseCard: context.state.lex.responseCard,
            alts: JSON.parse(response.sessionAttributes.appContext || '{}').altMessages,
          },
        );
      }
    }, intervalTimeInMs);
  },
  directMessage(context, message) {
    // eslint-disable-next-line
    // console.log(message);
    return context.dispatch('lexPostText', message.text.replace(/^\w/, c => c.toUpperCase()))
      .then((response) => {
        context.commit('setBotIsTexting', true);
        context.dispatch('processResponse', response);
      })
      .then(() => {
        if (context.state.lex.dialogState === 'Fulfilled') {
          context.dispatch('reInitBot');
        }
      })
      .catch((error) => {
        const errorMessage = (context.state.config.ui.showErrorDetails) ?
          ` ${error}` : '';
        console.error('error in TEST_postTextMessage', error);
        context.dispatch(
          'pushErrorMessage',
          'Sorry, would you mind to ask your question in a different way?' +
          `${errorMessage}`,
        );
        context.commit('setBotIsTexting', false);
      });
  },
  postTextMessageFromUser(context, message) {
    return context.dispatch('interruptSpeechConversation')
      .then(() => context.dispatch('pushMessage', message))
      .then(() => context.dispatch('directMessage', message));
  },
  postTextMessage(context, message) {
    return context.dispatch('interruptSpeechConversation')
      .then(() => context.dispatch('pushMessage', message))
      .then(() => context.dispatch('directMessage', {
        type: 'human',
        text: message.text.split(' ').reverse()[0],
      }));
  },
  lexPostText(context, text) {
    context.commit('setIsLexProcessing', true);
    const session = context.state.lex.sessionAttributes;
    delete session.appContext;
    return context.dispatch('getCredentials')
      .then(() => lexClient.postText(text, session))
      .then((data) => {
        context.commit('setIsLexProcessing', false);
        return context.dispatch('updateLexState', data)
          .then(() => Promise.resolve(data));
      })
      .catch((error) => {
        context.commit('setIsLexProcessing', false);
        throw error;
      });
  },
  lexPostContent(context, audioBlob, offset = 0) {
    context.commit('setIsLexProcessing', true);
    const session = context.state.lex.sessionAttributes;
    delete session.appContext;
    console.info('audio blob size:', audioBlob.size);
    let timeStart;

    return context.dispatch('getCredentials')
      .then(() => {
        timeStart = performance.now();
        return lexClient.postContent(
          audioBlob,
          session,
          context.state.lex.acceptFormat,
          offset,
        );
      })
      .then((lexResponse) => {
        const timeEnd = performance.now();
        console.info(
          'lex postContent processing time:',
          ((timeEnd - timeStart) / 1000).toFixed(2),
        );
        context.commit('setIsLexProcessing', false);
        return context.dispatch('updateLexState', lexResponse)
          .then(() => (
            context.dispatch('processLexContentResponse', lexResponse)
          ))
          .then(blob => Promise.resolve(blob));
      })
      .catch((error) => {
        context.commit('setIsLexProcessing', false);
        throw error;
      });
  },
  processLexContentResponse(context, lexData) {
    const { audioStream, contentType, dialogState } = lexData;

    return Promise.resolve()
      .then(() => {
        if (!audioStream || !audioStream.length) {
          const text = (dialogState === 'ReadyForFulfillment') ?
            'All done' :
            'There was an error';
          return context.dispatch('pollyGetBlob', text);
        }

        return Promise.resolve(new Blob([audioStream], { type: contentType }));
      });
  },
  updateLexState(context, lexState) {
    const lexStateDefault = {
      dialogState: '',
      inputTranscript: '',
      intentName: '',
      message: '',
      responseCard: null,
      sessionAttributes: {},
      slotToElicit: '',
      slots: {},
    };
    // simulate response card in sessionAttributes
    // used mainly for postContent which doesn't support response cards
    if ('sessionAttributes' in lexState &&
      'appContext' in lexState.sessionAttributes
    ) {
      try {
        const appContext = JSON.parse(lexState.sessionAttributes.appContext);
        if ('responseCard' in appContext) {
          lexStateDefault.responseCard =
            appContext.responseCard;
        }
      } catch (e) {
        const error =
          new Error(`error parsing appContext in sessionAttributes: ${e}`);
        return Promise.reject(error);
      }
    }
    context.commit('updateLexState', { ...lexStateDefault, ...lexState });
    if (context.state.isRunningEmbedded) {
      context.dispatch(
        'sendMessageToParentWindow',
        { event: 'updateLexState', state: context.state.lex },
      );
    }
    return Promise.resolve();
  },

  /***********************************************************************
   *
   * Message List Actions
   *
   **********************************************************************/
  pushMessage(context, message) {
    // before commit, send the message to dashbot
    // TODO: Intent has to be tracked in the Lex side
    const { type, text } = message;
    if (type === 'human') {
      const log = {
        text,
        userId: context.state.config.lex.sessionAttributes.uuid,
        platformJson: {
          tbd: 'n/a',
        },
        intent: {
          name: this.state.lex.intentName,
        },
      };
      // just save the user input for now
      context.commit('setLastUserInput', log);
    }
    if (type === 'bot') {
      const errMsg = 'could you please reword your answer';
      if (context.state.lastUserInput !== null) {
        if (text.match(errMsg) === null) {
          // dashbot.logIncoming(context.state.lastUserInput);
          axios.post(dashBotIncomingURL, context.state.lastUserInput)
            .then((/* response */) => {
              // eslint-disable-next-line
              // console.log(response);
            })
            .catch((error) => {
              // eslint-disable-next-line
              console.log(error);
            });
        } else {
          const log = context.state.lastUserInput;
          log.intent = {
            name: 'NotHandled',
          };
          // dashbot.logIncoming(log);
          axios.post(dashBotIncomingURL, log)
            .then((/* response */) => {
              // eslint-disable-next-line
              // console.log(response);
            })
            .catch((error) => {
              // eslint-disable-next-line
              console.log(error);
            });
        }
        context.commit('setLastUserInput', null);
      }
      axios.post(dashBotOutcomingURL, {
        text,
        userId: context.state.config.lex.sessionAttributes.uuid,
        platformJson: {
          tbd: 'n/a',
        },
      })
        .then((/* response*/) => {
          // eslint-disable-next-line
          // console.log(response);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    }
    context.commit('pushMessage', message);
  },
  pushErrorMessage(context, text, dialogState = 'Failed') {
    context.commit('pushMessage', {
      type: 'bot',
      text,
      dialogState,
    });
  },

  /***********************************************************************
   *
   * Credentials Actions
   *
   **********************************************************************/

  getCredentialsFromParent(context) {
    const expireTime = (awsCredentials && awsCredentials.expireTime) ?
      awsCredentials.expireTime : 0;
    const credsExpirationDate = new Date(expireTime);
    const now = Date.now();
    if (credsExpirationDate > now) {
      return Promise.resolve(awsCredentials);
    }
    return context.dispatch('sendMessageToParentWindow', { event: 'getCredentials' })
      .then((credsResponse) => {
        if (credsResponse.event === 'resolve' &&
            credsResponse.type === 'getCredentials') {
          return Promise.resolve(credsResponse.data);
        }
        const error = new Error('invalid credential event from parent');
        return Promise.reject(error);
      })
      .then((creds) => {
        const { AccessKeyId, SecretKey, SessionToken } = creds.data.Credentials;
        const { IdentityId } = creds.data;
        // recreate as a static credential
        awsCredentials = {
          accessKeyId: AccessKeyId,
          secretAccessKey: SecretKey,
          sessionToken: SessionToken,
          identityId: IdentityId,
          expired: false,
          getPromise() { return Promise.resolve(awsCredentials); },
        };

        return awsCredentials;
      });
  },
  getCredentials(context) {
    if (context.state.awsCreds.provider === 'parentWindow') {
      return context.dispatch('getCredentialsFromParent');
    }
    return awsCredentials.getPromise()
      .then(() => awsCredentials);
  },

  /***********************************************************************
   *
   * UI and Parent Communication Actions
   *
   **********************************************************************/

  toggleIsUiMinimized(context) {
    context.commit('toggleIsUiMinimized');
    return context.dispatch(
      'sendMessageToParentWindow',
      { event: 'toggleMinimizeUi' },
    );
  },
  sendMessageToParentWindow(context, message) {
    if (!context.state.isRunningEmbedded) {
      const error = 'sendMessage called when not running embedded';
      console.warn(error);
      return Promise.reject(error);
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (evt) => {
        messageChannel.port1.close();
        messageChannel.port2.close();
        if (evt.data.event === 'resolve') {
          resolve(evt.data);
        } else {
          const errorMessage =
            `error in sendMessageToParentWindow: ${evt.data.error}`;
          reject(new Error(errorMessage));
        }
      };
      window.parent.postMessage(
        message,
        context.state.config.ui.parentOrigin,
        [messageChannel.port2],
      );
    });
  },
};
