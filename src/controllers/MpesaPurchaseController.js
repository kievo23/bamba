const data = {}
import { MpesaPurchase } from '../models/Purchase.js'
import { Customer } from '../models/Customers.js'
import { B2bTransfer } from '../models/b2bTransfer.js'
import lipanampesa from '../mpesa4107028/lipa_na_mpesa_online.js';
import sendAirtime from "./Africastalking.js"
import { generateApiKey } from "generate-api-key";
import c2bregister001500 from "../mpesa001500/c2b_register.js"
import c2bregister4107028 from "../mpesa4107028/c2b_register.js"
import transaction_status001500 from "../mpesa001500/transaction_status.js"
import b2b001500 from "../mpesa001500/b2b.js"
import b2b4107028 from "../mpesa4107028/b2b.js"
import cron from "node-cron"

import { where } from 'sequelize';

const stkPush = async(req, res, next) => {
  console.log(req.body);
  //254710345130
  let phone = req.body.phone.replace(/\s+/g, '').slice(-9);
  let mpesaphone = req.body.mpesaphone.replace(/\s+/g, '').slice(-9);
  phone = "254"+phone;
  mpesaphone = "254"+mpesaphone;
  let amount = req.body.amount;
  let uuid = generateApiKey({method: 'string', length: 25, pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'});
  try {
      let result = await lipanampesa(mpesaphone,amount,process.env.SAFARICOM_RETURN_URL+"/"+uuid,req.body.ref);
      
      let stkReq = await MpesaPurchase.create({
        merchant_request_i_d : result.data.MerchantRequestID,
        purchasing_phone : mpesaphone,
        phone_no : phone,
        transaction_amount : amount,
        transaction_uuid: uuid
      });
      console.log(result.data );
      res.json(result.data)
  } catch (error) {
      console.log(error)
      res.json(error)
  }
}

const stkPushStatus = async(req, res) => {
  console.log(req.body);
  const mpesa = await MpesaPurchase.findOne({ 
    attributes: ['merchant_request_i_d','status','airtime_status'],
    where: { 
      merchant_request_i_d: req.body.merchant_request_i_d
  } });
  res.json(mpesa);
}

const stkReturn = async(req, res) => {
  const mpesa = await MpesaPurchase.findOne({ where: { 
    merchant_request_i_d: req.body.Body.stkCallback.MerchantRequestID,
    airtime_status: 0,
    transaction_uuid : req.params.uuid
  } });

  //mpesa.purchasing_phone = req.body.Body.stkCallback.CallbackMetadata.Item[3].Value;
  if(mpesa){
    console.log(req.body.Body.stkCallback.CallbackMetadata.Item)
    mpesa.transaction_reference = req.body.Body.stkCallback.CallbackMetadata.Item[1].Value;
    mpesa.transaction_amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
    mpesa.transaction_time = req.body.Body.stkCallback.CallbackMetadata.Item[2].Value;
    mpesa.transaction_type = "STK_PUSH";
    mpesa.mpesa_result_desc = req.body.Body.stkCallback.ResultDesc;
    mpesa.status = 1;
    mpesa.mpesa_payload = JSON.stringify(req.body);
    mpesa.save();

    //UPDATE USER
    let user = await Customer.findOne({
      where: {
        phone_no : mpesa.phone_no,
      }
    });
  
    if(user){
      user.recount_after_offer = user.recount_after_offer + 1;
      user.purchase_count = user.purchase_count + 1
      user.save()
    }else{
      let rst = await Customer.create({
        phone_no: mpesa.phone_no
      });
    }

    //SEND AIRTIME
    SendAirtime(mpesa.phone_no,mpesa.transaction_amount,mpesa);
  }

  res.json(mpesa);
}

const c2breturn = async (req, res) => {
  // {
  //   "TransactionType": "Pay Bill",
  //   "TransID": "SJC0U3TR8I",
  //   "TransTime": "20241012164525",
  //   "TransAmount": "5.00",
  //   "BusinessShortCode": "4107028",
  //   "BillRefNumber": "0105730538",
  //   "InvoiceNumber": "",
  //   "OrgAccountBalance": "1284.00",
  //   "ThirdPartyTransID": "",
  //   "MSISDN": "a8312439df14de505d8a111dd575bb9cb211444e7878b0beb6afc78874d6af3e",
  //   "FirstName": "KELVIN"
  // }
  let BillRefNumber = req.body.BillRefNumber.replace(/\s+/g, '').slice(-9);
  let transaction = await MpesaPurchase.create({ 
    transaction_type : "PAYBILL",
    transaction_amount : req.body.TransAmount,
    transaction_reference : req.body.TransID,
    transaction_time : req.body.TransTime,
    phone_no : "254"+req.body.BillRefNumber,
    purchasing_phone : req.body.MSISDN,
    mpesa_payload : JSON.stringify(req.body)
  });

  let user = await Customer.findOne({
    where: {
      phone_no : req.body.MSISDN,
    }
  });

  if(user){
    user.recount_after_offer = user.recount_after_offer + 1;
    user.purchase_count = user.purchase_count + 1
    user.save()
  }else{
    let rst = await Customer.create({
      phone_no: req.body.MSISDN
    });
  }

  //REQUEST CONFIRMATION
  let uuid = generateApiKey({method: 'string', length: 25, pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'});
  let confirmationRequest = await transaction_status001500(
    req.body.TransID,  
    "001500",
    "4",
    process.env.MPESA_TIMEOUT_URL,
    process.env.MPESA_CONFIRMATION_RETURN_URL+"/"+uuid,
    'A check of the transaction to make sure we are not robbed',
    'Occasion',
    process.env.MPESA_INITIATOR_001500,
    "TransactionStatusQuery"
  );

  transaction.merchant_request_i_d = confirmationRequest.data.OriginatorConversationID;
  transaction.transaction_uuid = uuid;
  transaction.save();
  console.log(confirmationRequest.data);

  //console.log(transaction)
  res.json({
    "ResultCode": 0,
    "ResultDesc" : "success"
  })
}

const c2bConfirmation = async(req, res) => {
  console.log(req.body)
  const mpesa = await MpesaPurchase.findOne({ where: { 
    merchant_request_i_d: req.body.Result.OriginatorConversationID,
    airtime_status: 0,
    transaction_uuid : req.params.uuid,
    transaction_reference : req.body.Result.ResultParameters.ResultParameter[12].Value
  } });
  //console.log(mpesa)
  if(mpesa){
    //SEND AIRTIME
    SendAirtime(mpesa.phone_no,mpesa.transaction_amount,mpesa);
    res.json({
      "ResultCode": 0,
      "ResultDesc" : "Transaction Authenticated"
    })
  }else{
    res.json({
      "ResultCode": 1,
      "ResultDesc" : "Transaction not found"
    })
  }
}

const b2bRequest = async(req,res) => {
  let uuid = generateApiKey({method: 'string', length: 25, pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'});
  let partyA = "4107028";
  let partyB = "525900";
  const b2bReq = await b2b4107028(
    partyA,
    partyB,
    "500",
    process.env.MPESA_B2BTIMEOUT_URL,
    process.env.MPESA_B2BCONFIRMATION_RETURN_URL+"/uuid",
    "4",
    "4",
    process.env.MPESA_INITIATOR_4107028,
    "BusinessPayBill",
    "bambaCredo.api",
    "B2B Request"
  )
  console.log(b2bReq.data)
  const b2b = await B2bTransfer.create({
    conversational_id : b2bReq.data.OriginatorConversationID,
    uuid : uuid,
    party_a : partyA,
    party_b : partyB
  });
  //console.log(b2b)
  res.json({status: 0, msg: "success"})
}

const b2bReturn = async(req,res) => {
  const b2btransfer = await B2bTransfer.findOne({ where: { 
    conversational_id : req.body.Result.OriginatorConversationID,
    uuid : req.params.uuid
  }});
  //console.log(b2btransfer)
  if(b2btransfer){
    b2btransfer.transaction_reference = req.body.Result.TransactionID;
    b2btransfer.amount = req.body.Result.ResultParameters.ResultParameter[1].Value;
    b2btransfer.save();
  }
  res.json({status: 0, msg: "success"})
}

const SendAirtime = async(phone,amount,mpesa) => {
  amount = Math.floor(amount);
  let result = await sendAirtime(phone,amount);
  //console.log(result.data)
  if(result.data.errorMessage === "None"){
    mpesa.airtime_amount = result.data.responses[0].amount,
    mpesa.airtime_discount = result.data.responses[0].discount,
    mpesa.airtime_payload = JSON.stringify(result.data);
    mpesa.airtime_status = 1
    mpesa.save();
  }
}

const registerUrl4107028 = async(req, res) => {
  let confirmURL = process.env.ConfirmationMpesaURL;
  let validateURL = process.env.ValidationMpesaURL;
  let feedback = await c2bregister4107028(confirmURL,validateURL,"4107028")
  console.log(feedback.data)
  res.json(feedback.data);
}

const registerUrl001500 = async(req, res) => {
  let confirmURL = process.env.ConfirmationMpesaURL;
  let validateURL = process.env.ValidationMpesaURL;
  let feedback = await c2bregister001500(confirmURL,validateURL,"001500")
  console.log(feedback.data)
  res.json(feedback.data);
}

export {
    stkPush,
    stkReturn,
    c2breturn,
    registerUrl4107028,
    registerUrl001500,
    stkPushStatus,
    c2bConfirmation,
    b2bRequest,
    b2bReturn
}