import Cloudflare from 'cloudflare';
import pkg from 'lodash';
const {sample} = pkg;

/**
 * Choose a random image from the repository and provide its url.
 * @param {Object} env Environment object for the Worker.
 * @return {Promise<string>} The url of an image or video which is cute.
 */
export async function getCuteUrl(env) {
  const client = new Cloudflare({apiToken: env.CLOUDFLARE_API_TOKEN});
  const images = await client.images.v2.list({account_id: env.CLOUDFLARE_ACCOUNT_ID});
  const imageURL = sample(images.images).variants[0];
  return imageURL;
}
