import express from "express"
import 'dotenv/config'

import {MpesaPurchase} from './models/Purchase.js'
import {AfricastalkingModel} from './models/Africastalking.js'
import lipanampesa from './mpesa/lipa_na_mpesa_online.js'
import getAccessToken from './mpesa/oauth.js'
import mpesaPurchaseRouter from './routes/mpesaPurchaseRouter.js'
import sendAirtime from "./controllers/Africastalking.js"
import Africastalking from "africastalking";
import { generateApiKey } from "generate-api-key";
import apiKey from './middlewares/apikey.js'
import cors from 'cors';
import bodyParser from 'body-parser';

const PORT = process.env.PORT;
const app = express();

const router = express.Router();

const bambaOrigin = process.env.FRONT_END_URL;
const safaricomOrigin = process.env.SAFARICOM_RETURN_URL;

// Create a CORS options object
const corsOptions = {
  origin: (origin, callback) => {
    //console.log(origin);
    if ([bambaOrigin,safaricomOrigin,"http://localhost:5173"].includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

//TESTS

app.get("/", (req, res) => {
  res.json("Welcome to bamba backend. We are empowering Airtel users to access credit via Mpesa. /sendcredit, /apikey, /to");
})

app.get("/sendcredit", async (req, res) => {
  let result = await sendAirtime("+254710345130","5");
  console.log(result.data)
  res.json(JSON.stringify(result.data));
});

app.get("/apikey", apiKey, (req, res) => {
  let apiKey = generateApiKey({method: 'string', length: 20});
  res.json(apiKey);
});

app.get("/to", async (req, res) => {
  try {
      let result = await lipanampesa('254710345130','60','https://bamba.ke','254710345130');
      console.log(result.data)
      res.json(JSON.stringify(result.data))
  } catch (error) {
      console.log(error)
      res.json(JSON.stringify(error))
  }
})

// Middleware to parse application/json
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use('/api', mpesaPurchaseRouter);

// app.get("/sql", async(req, res) => {
//   let stkReq = await MpesaPurchase.create({
//     merchant_request_i_d : "result.data.MerchantRequestID"
//   });
//   console.log(stkReq )
// })


app.listen(PORT, () => {
    console.log(`App running on hazel ${PORT}`);
    
})