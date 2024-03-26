import {Ai} from '@cloudflare/ai';

/**
 * Send the provided prompt to the genAI model and return the response.
 * @param {object} interaction The user interaction from Discord.
 * @param {any} binding The binding for the worker AI.
 * @return {Promise<string>} The generated response from the model.
 */
export async function sendChat(interaction, binding) {
  const usernameMappings = {
    rvngizswt: 'Nick',
    brosevelte: 'Carter',
    roeler: 'Rachel',
  };
  const ai = new Ai(binding);
  const username = usernameMappings[interaction.user.username] ?? usernameMappings[interaction.user.global_name] ?? interaction.user.username;
  const messages = [
    {role: 'system',
      content: 'You are NickBot, a friendly Discord bot assistant to your owner, Nick and his friends.',
    },
    {role: 'system',
      content: `You are talking to ${username}`,
    },
    {
      role: 'user',
      content: interaction.data.options[0].value,
    },
  ];
  const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {messages});

  return response?.response;
}
