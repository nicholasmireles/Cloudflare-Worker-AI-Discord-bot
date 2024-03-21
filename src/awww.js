import process from 'node:process';
import Cloudflare from 'cloudflare';
var _ = require('lodash/core')

const client = new Cloudflare();

/**
 * Choose a random image from the repository and provide its url.
 * @return {string} The url of an image or video which is cute.
 */
export async function getCuteUrl() {
  var images = await client.images.v2.list()
  var imageURL = _.sample(images)?.variants[0]
  return imageURL;
}