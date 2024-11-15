const data = {}
import { MpesaPurchase } from '../models/Purchase.js'
import { Op } from 'sequelize';
// Validation middleware for date parameters

const fetchData = async(req, res) => {
  const { startDate, endDate } = req.query;
  //console.log(startDate)
  try {
    let where = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);

      where = {
        createdAt: {
          [Op.between]: [start, end]
        }
      };
    }

    const purchases = await MpesaPurchase.findAll({
      where,
      attributes: ['id','phone_no','transaction_amount','transaction_time','transaction_type','transaction_reference','business_short_code','status','airtime_status','created_at'],
    });
    //console.log(purchases)
    res.json(purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching Mpesa purchases' });
  }
};

const dashboard = async(req,res) => {
  res.render('index')
}

export {
  fetchData,
  dashboard
}