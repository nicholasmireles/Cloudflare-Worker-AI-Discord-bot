import Cloudflare from 'cloudflare';
const _ = import('lodash/core');

/**
 * Choose a random image from the repository and provide its url.
 * @return {Promise<string>} The url of an image or video which is cute.
 */
export async function getCuteUrl() {
  const client = new Cloudflare();
  const images = await client.images.v2.list();
  const imageURL = _.sample(images)?.variants[0];
  return imageURL;
}
