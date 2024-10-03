const data = {}
import { MpesaPurchase } from '../models/Purchase.js'
import { Customers } from '../models/Customers.js'
import lipanampesa from '../mpesa/lipa_na_mpesa_online.js';
import sendAirtime from "./Africastalking.js"
import { generateApiKey } from "generate-api-key";

const stkPush = async(req, res) => {
  console.log(req.body);
  //254710345130
  let phone = req.body.phone.replace(/\s+/g, '').slice(-9);
  let mpesaphone = req.body.mpesaphone.replace(/\s+/g, '').slice(-9);
  phone = "254"+phone;
  mpesaphone = "254"+mpesaphone;
  let amount = req.body.amount;
  let uuid = generateApiKey({method: 'string', length: 25, pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'});
  try {
      let result = await lipanampesa(phone,amount,process.env.SAFARICOM_RETURN_URL+"/"+uuid,req.body.ref);
      
      res.json(JSON.stringify(result.data))
      let stkReq = await MpesaPurchase.create({
        merchant_request_i_d : result.data.MerchantRequestID,
        purchasing_phone : mpesaphone,
        phone_no : phone,
        transaction_amount : amount,
        transaction_uuid: uuid
      });
      console.log(stkReq.merchant_request_i_d )
      
  } catch (error) {
      console.log(error)
      res.json(JSON.stringify(error))
  }
}

const stkReturn = async(req, res) => {
  const mpesa = await MpesaPurchase.findOne({ where: { 
    merchant_request_i_d: req.body.Body.stkCallback.MerchantRequestID,
    airtime_status: 0,
    transaction_uuid : req.params.uuid
  } });

  //mpesa.purchasing_phone = req.body.Body.stkCallback.CallbackMetadata.Item[3].Value;
  if(mpesa){
    console.log(req.body.Body.stkCallback.CallbackMetadata.Item[1].Value)
    mpesa.transaction_reference = req.body.Body.stkCallback.CallbackMetadata.Item[1].Value;
    mpesa.transaction_amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
    mpesa.mpesa_result_desc = req.body.Body.stkCallback.ResultDesc;
    mpesa.status = 1;
    mpesa.mpesa_payload = JSON.stringify(req.body);
    mpesa.save();

    let result = await sendAirtime(mpesa.phone_no,mpesa.transaction_amount);
    console.log(result.data)
    if(result.data.errorMessage === "None"){
      mpesa.airtime_amount = result.data.responses[0].amount,
      mpesa.airtime_discount = result.data.responses[0].discount,
      mpesa.airtime_payload = JSON.stringify(result.data);
      mpesa.airtime_status = 1
      mpesa.save();
    }
  }

  res.send(mpesa);
}


export {
    stkPush,
    stkReturn
}