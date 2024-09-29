const data = {}
import { MpesaPurchase } from '../models/Purchase.js'
import { Customers } from '../models/Customers.js'
import lipanampesa from '../mpesa/lipa_na_mpesa_online.js';
import sendAirtime from "./Africastalking.js"


const insertPurchase = async(req, res) => {
  res.json("Welcome to bamba backend. We are empowering Airtel users to access credit via Mpesa")
}

const seePurchase = (req, res) => {
  res.json("see purchase")
}

const stkPush = async(req, res) => {
  console.log(req.body);
  //254710345130
  let phone = req.body.phone.replace(/\s+/g, '').slice(-9);
  let mpesaphone = req.body.mpesaphone.replace(/\s+/g, '').slice(-9);
  phone = "254"+phone;
  mpesaphone = "254"+mpesaphone;
  let amount = req.body.amount;
  try {
      let result = await lipanampesa(phone,amount,process.env.SAFARICOM_RETURN_URL,req.body.ref);
      
      res.json(JSON.stringify(result.data))
      let stkReq = await MpesaPurchase.create({
        merchant_request_i_d : result.data.MerchantRequestID,
        purchasing_phone : mpesaphone,
        phone_no : phone,
        transaction_amount : amount
      });
      console.log(stkReq.merchant_request_i_d )
      
  } catch (error) {
      console.log(error)
      res.json(JSON.stringify(error))
  }
}

const stkReturn = async(req, res) => {
  // req.body.Body.stkCallback.MerchantRequestID
  // req.body.Body.stkCallback.ResultDesc
  // req.body.Body.stkCallback.CallbackMetadata.Item[0].Value //amount
  // req.body.Body.stkCallback.CallbackMetadata.Item[1].Value //MpesaReceiptNumber
  // req.body.Body.stkCallback.CallbackMetadata.Item[2].Value //TransactionDate
  // req.body.Body.stkCallback.CallbackMetadata.Item[3].Value //PhoneNumber

  const mpesa = await MpesaPurchase.findOne({ where: { 
    merchant_request_i_d: req.body.Body.stkCallback.MerchantRequestID,
    airtime_status: 0
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
    insertPurchase,
    seePurchase,
    stkPush,
    stkReturn
}