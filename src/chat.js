import {Ai} from '@cloudflare/ai';

/**
 * Send the provided prompt to the genAI model and return the response.
 * @param {any} binding The binding for the worker AI.
 * @param {string} prompt The user prompt to send to the genAI model.
 * @return {Promise<string>} The generated response from the model.
 */

export async function sendChat(prompt, binding) {
  const ai = new Ai(binding);
  const messages = [
    {role: 'system', content: 'You are a friendly assistant to your Owner, Nick. He may or may not be the person with whom you are interacting.'},
    {
      role: 'user',
      content: prompt,
    },
  ];
  const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {messages});

  return response?.response;
}
