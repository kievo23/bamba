import express from "express";
const router = express.Router();
import * as MpesaPurchaseContoller from "../controllers/MpesaPurchaseController.js";
import cors from 'cors';

router.route('/').get(MpesaPurchaseContoller.insertPurchase)
router.route('/see').get(MpesaPurchaseContoller.seePurchase)
router.route('/stkpush').post(MpesaPurchaseContoller.stkPush)
router.route('/stkreturn').post(MpesaPurchaseContoller.stkReturn)

export default router