import express from "express";
const router = express.Router();
import * as MpesaPurchaseContoller from "../controllers/MpesaPurchaseController.js";
import apiKey from '../middlewares/apikey.js'


router.route('/stkreturn/:uuid').post(MpesaPurchaseContoller.stkReturn)
router.route('/c2bconfirmation/:uuid').post(MpesaPurchaseContoller.c2bConfirmation)
router.route('/registerurls4107028').get(MpesaPurchaseContoller.registerUrl4107028)
router.route('/registerurls001500').get(MpesaPurchaseContoller.registerUrl001500)
router.route(process.env.ConfirmationMpesaURL).post(MpesaPurchaseContoller.c2breturn)
router.route('/stkpush').post(apiKey,MpesaPurchaseContoller.stkPush)
router.route('/stkpushstatus').post(apiKey,MpesaPurchaseContoller.stkPushStatus)
router.route('/c2btimeout').post((req, res)=> {
    res.json({status: 200,msq: "queued"})
})

//B2B TEST
router.route('/b2bRequest4107028').get(MpesaPurchaseContoller.b2bRequest4107028)
router.route('/b2bRequest001500').get(MpesaPurchaseContoller.b2bRequest001500)
router.route('/b2bConfirmation/:uuid').post(MpesaPurchaseContoller.b2bReturn)

export default router