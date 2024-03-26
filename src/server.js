/* eslint-disable linebreak-style */
/**
 * The core server that runs on a Cloudflare worker.
 */

import {Router} from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';

import {AWW_COMMAND, INVITE_COMMAND, CHAT_COMMAND} from './commands.js';
import {getCuteUrl} from './awww.js';
import {sendChat} from './chat.js';
import {InteractionResponseFlags} from 'discord-interactions';

// eslint-disable-next-line require-jsdoc
class JsonResponse extends Response {
  // eslint-disable-next-line require-jsdoc
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

// eslint-disable-next-line new-cap
const router = Router();

/**
 * Callback to make the actual request to the LLM, wait for the response, and update the original message.
 * @param {object} env The processing environment for the worker.
 * @param {object} interaction The interaction received by the server.
 */
async function deferLlm(env, interaction) {
  const llmResponse = await sendChat(interaction, env.AI);
  const response = await fetch(
      `https://discord.com/api/v10/webhooks/${env.DISCORD_APPLICATION_ID}/${interaction.token}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bot ${env.DISCORD_TOKEN}`,
        },
        method: 'POST',
        body: JSON.stringify({
          content: llmResponse,
        })},
  );
  console.log(response.status);
  console.log(await response.json());
}


/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * Main route for all requests sent from Discord.  All incoming messages will
 * include a JSON payload described here:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
router.post('/', async (request, env, context) => {
  const {isValid, interaction} = await server.verifyDiscordRequest(
      request,
      env,
  );
  if (!isValid || !interaction) {
    return new Response('Bad request signature.', {status: 401});
  }

  if (interaction.type === InteractionType.PING) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // Most user commands will come as `APPLICATION_COMMAND`.
    switch (interaction.data.name.toLowerCase()) {
      case AWW_COMMAND.name.toLowerCase(): {
        const cuteUrl = await getCuteUrl(env);
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: cuteUrl,
          },
        });
      }
      case INVITE_COMMAND.name.toLowerCase(): {
        const applicationId = env.DISCORD_APPLICATION_ID;
        const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: INVITE_URL,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
      case CHAT_COMMAND.name.toLowerCase():
        context.waitUntil(deferLlm(env, interaction));
        return new JsonResponse({
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '',
          }});
      default:
        return new JsonResponse({error: 'Unknown Type'}, {status: 400});
    }
  }

  console.error('Unknown Type');
  return new JsonResponse({error: 'Unknown Type'}, {status: 400});
});
router.all('*', () => new Response('Not Found.', {status: 404}));

// eslint-disable-next-line require-jsdoc
async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
  if (!isValidRequest) {
    return {isValid: false};
  }

  return {interaction: JSON.parse(body), isValid: true};
}

const server = {
  verifyDiscordRequest: verifyDiscordRequest,
  fetch: async function(request, env, ctx) {
    return router.handle(request, env, ctx);
  },
};

export default server;
