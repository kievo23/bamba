import axios from "axios";

const AirtimeInstance = async () => {

  return axios.create({
    baseURL: 'https://api.africastalking.com',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'apiKey': `${process.env.AfricasTalkingApiKey}`
    },
    data : {'username' : 'bambaCredo'}
  })
}

const sendAirtime = async (phone,amount) => {
  let request = await AirtimeInstance();
  return request.post('version1/airtime/send', {
      username : `${process.env.AfricasTalkingUsername}`,
      maxNumRetry: 2,
      recipients : JSON.stringify([{phoneNumber: phone, amount: `KES ${amount}` }])
  });
}

//Sample Response
//'{"errorMessage":"None","numSent":1,"responses":[{"amount":"KES 7.0000","discount":"KES 0.2800","errorMessage":"None","phoneNumber":"+254105730538","requestId":"ATQid_c5c74072d186148b43226584ce28d3a4","status":"Sent"}],"totalAmount":"KES 7.0000","totalDiscount":"KES 0.2800"}'

export default sendAirtime

