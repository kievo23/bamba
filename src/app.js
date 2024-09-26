import express from "express"
import 'dotenv/config'

import {MpesaPurchase} from './models/Purchase.js'
import {AfricastalkingModel} from './models/Africastalking.js'
import lipanampesa from './mpesa/lipa_na_mpesa_online.js'
import getAccessToken from './mpesa/oauth.js'
import mpesaPurchaseRouter from './routes/mpesaPurchaseRouter.js'
import sendAirtime from "./controllers/Africastalking.js"
import Africastalking from "africastalking";

const PORT = process.env.PORT;
const app = express();

const router = express.Router();
app.use('/', mpesaPurchaseRouter);

//TESTS

app.get("/to", async (req, res) => {
    try {
        let result = await lipanampesa('254710345130','60','https://bamba.ke','254710345130');
        console.log(result)
        res.json(JSON.stringify(result))
    } catch (error) {
        console.log(error)
        res.json(JSON.stringify(error))
    }
})

app.get("/sendcredit", async (req, res) => {
    let result = await sendAirtime("+254739670656","15");
    console.log(result.data)
    res.json(JSON.stringify(result.data));
});


app.listen(PORT, () => {
    console.log(`App running on hazel ${PORT}`);
    
})