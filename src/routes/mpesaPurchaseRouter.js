import express from "express";
const router = express.Router();
import * as MpesaPurchaseContoller from "../controllers/MpesaPurchaseController.js";


router.route('/').get(MpesaPurchaseContoller.insertPurchase)
router.route('/see').get(MpesaPurchaseContoller.seePurchase)

export default router