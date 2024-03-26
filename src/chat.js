import {Ai} from '@cloudflare/ai';

/**
 * Send the provided prompt to the genAI model and return the response.
 * @param {object} interaction The user interaction from Discord.
 * @param {any} binding The binding for the worker AI.
 * @return {Promise<string>} The generated response from the model.
 */
export async function sendChat(interaction, binding) {
  const ai = new Ai(binding);
  const messages = [
    {role: 'system',
      content: 'You are NickBot, a friendly assistant to your owner, Nick and his friends. He may or may not be the person with whom you are interacting.',
    },
    {role: 'assistant',
      content: `You are talking to ${interaction.member}`,
    },
    {
      role: 'user',
      content: interaction.data.options[0].value,
    },
  ];
  console.log(messages);
  console.log(interaction?.member);
  const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {messages});

  return response?.response;
}
