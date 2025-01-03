import express from "express"
import 'dotenv/config'

import mpesaPurchaseRouter from './routes/mpesaPurchaseRouter.js'
import testsRouter from './routes/testsRouter.js'
import bodyParser from 'body-parser';
import cors from 'cors';
import cron from "node-cron"
import log from "./models/Logging.js";
import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from 'url';
//we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT;
const app = express();
const router = express.Router();

// set our default template engine to "ejs"
// which prevents the need for using file extensions
app.set('view engine', 'ejs');

// set views for error and 404 pages
app.set('views', path.join(__dirname, 'views'));

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

app.use(bodyParser.json());
app.use(express.static('public'))
app.use(cors());

// app.use((req, res, next) => {
//   console.log('Request received:', req.method, req.path);
//   console.log('Request headers:', req.headers);
//   next();
// });

app.get("/", (req, res, next) => {
  res.json("Welcome to bamba backend. We are empowering Airtel users to access credit via Mpesa. /sendcredit, /apikey, /api/b2bRequest4107028, /api/b2bRequest001500");
})

app.use('/api', mpesaPurchaseRouter);
app.use('/test', testsRouter);

app.listen(PORT, '0.0.0.0', () => {

  // fs.writeFile(process.env.LOGGING_DIR, "Keeping an eye on MPESA", err => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     // file written successfully
  //   }
  // });
  console.log(`App running on hazel ${PORT}`);
});

// cron.schedule('* * * * * *', () => {
//   console.log('running every minute 1, 2, 4 and 5');
// });