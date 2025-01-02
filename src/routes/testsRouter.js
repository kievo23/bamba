import express from "express";
const router = express.Router();
import { generateApiKey } from "generate-api-key";
import apiKey from '../middlewares/apikey.js'
import sendAirtime from "../controllers/Africastalking.js"
import { MpesaPurchase } from '../models/Purchase.js'
import Africastalking from "africastalking";
import {AfricastalkingModel} from '../models/Africastalking.js'
import lipanampesa from '../mpesa4107028/lipa_na_mpesa_online.js'
import getAccessToken from '../mpesa4107028/oauth.js'

router.post("/sendcredit", async (req, res) => {
  let result = await sendAirtime(req.body.phone,req.body.amount);
  console.log(result.data)
  res.json(JSON.stringify(result.data));
});

router.get("/apikey", apiKey, (req, res) => {
    let apiKey = generateApiKey({method: 'string', length: 20});
    res.json(apiKey);
});

router.get("/stkpush", async (req, res) => {
    try {
        let result = await lipanampesa('254710345130','60','https://bamba.ke','254710345130');
        console.log(result.data)
        res.json(result.data)
    } catch (error) {
        console.log(error)
        res.json(JSON.stringify(error))
    }
})

  export default router