import express from "express";
const router = express.Router();
import * as MpesaPurchaseContoller from "../controllers/MpesaPurchaseController.js";
import apiKey from '../middlewares/apikey.js'
import cors from 'cors';


router.route('/stkreturn/:uuid').post(MpesaPurchaseContoller.stkReturn)
router.route('/registerurls').get(MpesaPurchaseContoller.registerUrl)
router.route('/bambaconfirmationmpesa2020').post(MpesaPurchaseContoller.c2breturn)
router.route('/stkpush').post(apiKey,MpesaPurchaseContoller.stkPush)
router.route('/stkpushstatus').post(apiKey,MpesaPurchaseContoller.stkPushStatus)

export default router