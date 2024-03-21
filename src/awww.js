// import process from 'node:process';

/**
 * Ping the CloudFlare API to get latest list of images.
 * @return {string[]} The url of an image or video which is cute.
 */
// async function getImageIDs() {
//   cloudFlareToken = process.env.CLOUDFLARE_TOKEN;
//   const options = {
//     method: 'GET',
//     headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${cloudFlareToken}`},
//   };

//   return fetch('https://api.cloudflare.com/client/v4/accounts/account_id/images/v2', options)
//       .then((response) => response.json().results)
//       .then((response) => console.log(response))
//       .catch((err) => console.error(err));
// }

/**
 * Reach out to the reddit API, and get the first page of results from
 * r/aww. Filter out posts without readily available images or videos,
 * and return a random result.
 * @return {int} The url of an image or video which is cute.
 */
export async function getCuteUrl() {
  const randomImageIdx = Math.floor(Math.random() * imageIDs.length);
  const randomImageID = imageIDs[randomImageIdx];
  const randomURL = `${imageUrl}/${randomImageID}/public`;
  return randomURL;
}

export const imageUrl = 'https://imagedelivery.net/manIcFitfg0KVgoGlEi88Q';
export const imageIDs = ['d4c4fb0b-f121-4e27-d727-0e0bb1e56a00', '24eb3ca7-4011-4284-39d2-da935b998000',
  '53b17833-cc6e-47ff-6e0c-5d1605cd7600', 'd8e863b4-cc9b-40e1-ea36-331ccba0b300',
  'c8edb90c-0eb3-412b-140c-112288efff00', '724c6dd5-e955-48e3-70f1-6972d65d5800',
  '4a2c570b-e5ff-48fc-a8e3-1d70c49a2a00', '5f6825e6-3cd3-499b-9c56-cfddfa4aef00',
  'c9222f3b-4a6b-4edd-a790-29c87148b400', 'fa67abfa-c402-4b0d-88e7-ee4a645eff00',
  'ba5d8e95-493a-4ef2-2678-63d20a15cd00', 'a75b9995-1ab2-4827-3d7c-4df04d28ab00',
  '883421aa-f52a-4d7c-e20e-8badcf60fa00', '3bf8ada0-9799-4093-451d-27ffe6fb4900',
  'd5ce73cc-2fd9-4c84-1b3e-c57b76fc5c00', 'b25c74e1-bc0e-4baa-7952-492e8d652c00',
  'a32c8b49-d600-48c3-04c9-f74c8caa8200', 'f9bf3b56-1c6a-41f2-e9a5-83f39712e300',
  '1d12154b-c6dc-4b0a-0900-3976fcedb400', 'dfa125e5-90ac-47f8-b2fd-7ee45fea6000',
  '692af1f2-cebb-44d2-b514-477cf8973d00', '6a804626-6012-46b5-23a6-44c37994d000',
  '04c2163d-5605-48df-4fab-2f8ba617a200', 'f731185d-871b-4938-1646-16460325ba00',
  '2d7131fa-08b4-44d5-8eec-d12221df2100', '4e00096b-2642-4e9e-56b1-9b4b39dc5700',
  '71dae3e1-f662-42a4-f427-b02a1cf22400', 'f6c46bd4-eb5e-41bc-a7d5-f8669acc3a00'];
