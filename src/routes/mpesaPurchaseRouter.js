import express from "express";
const router = express.Router();
import * as MpesaPurchaseContoller from "../controllers/MpesaPurchaseController.js";
import cors from 'cors';

const bambaOrigin = process.env.FRONT_END_URL;
const mpesaOrigin = process.env.MPESA_BASEURL;

// Create a CORS options object
const corsOptions = {
    origin: (origin, callback) => {
      //console.log(origin);
      if ([bambaOrigin,mpesaOrigin,"http://localhost:5173"].includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200
  };

router.route('/stkreturn/:uuid').post(MpesaPurchaseContoller.stkReturn)

router.route('/stkpush')
.options(cors(corsOptions))
.post(MpesaPurchaseContoller.stkPush);

export default router