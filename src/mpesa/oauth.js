import axios from "axios";
let res;

const consumer_secret = process.env.MPESA_CONSUMER_SECRET;
const consumer_key = process.env.MPESA_CONSUMER_KEY;

const getAccessToken = function(baseURL = null)  {
  const auth = Buffer.from(process.env.MPESA_CONSUMER_KEY + ':' + process.env.MPESA_CONSUMER_SECRET).toString('base64');
  const options = {
    method: 'GET',
    url: process.env.MPESA_URL+'/oauth/v1/generate',
    params: {grant_type: 'client_credentials'},
    headers: {
      Authorization: `Basic ${auth}`
    }
  };
  console.log("authorization")
  console.log(auth)
  return axios.request(options);
}

export default getAccessToken