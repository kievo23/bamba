import express from "express";
const router = express.Router();
import * as MpesaPurchaseContoller from "../controllers/MpesaPurchaseController.js";

router.route('/stkpush').post(MpesaPurchaseContoller.stkPush)
router.route('/stkreturn').post(MpesaPurchaseContoller.stkReturn)

export default router