import express from "express"
import 'dotenv/config'

import {MpesaPurchase} from './models/Purchase.js'

import mpesaPurchaseRouter from './routes/mpesaPurchaseRouter.js'

import * as MpesaPurchaseContoller from "./controllers/MpesaPurchaseController.js";
import testsRouter from './routes/testsRouter.js'
import bodyParser from 'body-parser';
import cors from 'cors';
import cron from "node-cron"

const PORT = process.env.PORT;
const app = express();
const router = express.Router();

const bambaOrigin = process.env.FRONT_END_URL;
const mpesaOrigin = process.env.MPESA_BASEURL;
const confirmURL = process.env.ConfirmationMpesaURL;

// Create a CORS options object
const corsOptions = {
  origin: (origin, callback) => {
    console.log(origin);
    if ([bambaOrigin,mpesaOrigin].includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.json("Welcome to bamba backend. We are empowering Airtel users to access credit via Mpesa. /sendcredit, /apikey, /to");
})

app.use('/api', mpesaPurchaseRouter);
app.use('/test', testsRouter);

app.listen(PORT, () => {
    console.log(`App running on hazel ${PORT}`);
});

// cron.schedule('* * * * * *', () => {
//   console.log('running every minute 1, 2, 4 and 5');
// });