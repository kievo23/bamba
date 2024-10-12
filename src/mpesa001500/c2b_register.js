import request from './request.js'
/**
 * C2B Register URL
 * @name C2BRegister
 * @function
 * @description Use this API to register validation and confirmation URLs on M-Pesa
 * @see {@link https://developer.safaricom.co.ke/c2b/apis/post/registerurl| C2B Register URL}
 * @param  {string} confirmationUrl            Validation URL for the client
 * @param  {string} validationUrl              Confirmation URL for the client
 * @param  {number} [shortCode=null]           The short code of the organization.
 * @param  {string} [responseType='Completed'] Default response type for timeout. Incase a tranaction times out, Mpesa will by default Complete or Cancel the transaction
 * @return {Promise}
 */
const c2bregister = async function (confirmationUrl, validationUrl, shortCode = '001500', responseType = 'Completed') {
    const req = await request()
    return req.post('/mpesa/c2b/v2/registerurl', {
      'ShortCode': shortCode,
      'ResponseType': responseType,
      'ConfirmationURL': "https://api.bamba.ke/api"+confirmationUrl,
      'ValidationURL': "https://api.bamba.ke/api"+validationUrl
    })
  }

export default c2bregister