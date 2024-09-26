import axios  from 'axios'
import getAccessToken from './oauth.js'

const request = async function (_baseURL = null) {
    const credentials = await getAccessToken()
    const instance = axios.create({
      baseURL: process.env.MPESA_BASEURL,
      timeout: 5000,
      headers: {
        'Authorization': 'Bearer ' + credentials.data['access_token'],
        'Content-Type': 'application/json'
      }
    })
    return instance
  }

export default request