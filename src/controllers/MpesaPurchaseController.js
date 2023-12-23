const data = {}
import { MpesaPurchase } from '../models/Purchase.js'

const insertPurchase = async(req, res) => {
    const jane = await MpesaPurchase.create({ phone_no: "Joan Wanjiku", purchasing_phone: "0710321234", status: 1, amount: "560" });
    console.log(jane.phone_no);
    res.json("db insertion")
}

const seePurchase = (req, res) => {
    res.json("see purchase")
}

export {
    insertPurchase,
    seePurchase
}