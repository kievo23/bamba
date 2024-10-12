import axios from "axios";
let res;

const consumer_secret = process.env.MPESA_CONSUMER_SECRET_001500;
const consumer_key = process.env.MPESA_CONSUMER_KEY_001500;

const getAccessToken = function(mpesa_baseURL = null)  {
  const auth = Buffer.from(consumer_key + ':' + consumer_secret).toString('base64');
  const options = {
    method: 'GET',
    url: process.env.MPESA_BASEURL+'/oauth/v1/generate',
    params: {grant_type: 'client_credentials'},
    headers: {
      Authorization: `Basic ${auth}`
    }
  };
  //console.log("authorization")
  //console.log(auth)
  //console.log(options)
  return axios.request(options);
}

export default getAccessToken