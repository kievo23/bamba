import request from './request.js'
/**
 * Lipa Na M-Pesa Online Payment API
 * @name lipaNaMpesaOnline
 * @description Use this API to initiate online payment on behalf of a customer.
 * @see {@link https://developer.safaricom.co.ke/lipa-na-m-pesa-online/apis/post/stkpush/v1/processrequest|Lipa Na M-Pesa Online Payment API }
 * @param  {number} senderMsisdn                              The MSISDN sending the funds
 * @param  {number} amount                                    The amount to be transacted
 * @param  {string} callbackUrl                               Call Back URL
 * @param  {string} accountRef                                Account Reference
 * @param  {string} [transactionDesc='Lipa na mpesa online']  any string of less then 20 characters
 * @param  {string} [transactionType='CustomerPayBillOnline'] The transaction type to be used for the request 'CustomerPayBillOnline'
 * @param  {number} [shortCode=null]                          The organization shortcode used to receive the transaction
 * @param  {string} [passKey=null]                            Lipa na mpesa passKey
 * @return {Promise}
 */

const lipanampesa = async function (senderMsisdn, amount, callbackUrl, accountRef, transactionDesc = 'Lipa na mpesa online', transactionType = 'CustomerPayBillOnline', shortCode = null, passKey = null) {
    const _shortCode = process.env.MPESA_SHORTCODE
    const _passKey = passKey || process.env.lipaNaMpesaShortPass
    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)
    const password = Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64')
    const req = await request()
    return req.post('/mpesa/stkpush/v1/processrequest', {
      'BusinessShortCode': _shortCode,
      'Password': password,
      'Timestamp': timeStamp,
      'TransactionType': transactionType,
      'Amount': amount,
      'PartyA': senderMsisdn,
      'PartyB': _shortCode,
      'PhoneNumber': senderMsisdn,
      'CallBackURL': callbackUrl,
      'AccountReference': accountRef,
      'TransactionDesc': transactionDesc
    })
  }

  export default lipanampesa;