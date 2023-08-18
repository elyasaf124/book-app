import express from 'express'
import morgan from 'morgan'
import dotenv from "dotenv";
import { router as bookingRouter } from './routes/bookingRoutes.js'
import { router as bookRouter } from './routes/bookRoutes.js'
import { router as userRouter } from './routes/userRoutes.js'
import { router as authRouter } from './routes/authRoutes.js'
import { router as webhookRouter } from "./routes/webhookRoutes.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import helmet from "helmet";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import { AppError, globalErrorHandlerNew } from './utilis/appError.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: __dirname + `/config.env` });

export let webOrigin = '';
if (process.env.NODE_ENV === "development") {
    console.log("dev");
    webOrigin = [process.env.WEB_APP_URL_DEV, process.env.WEB_APP_URL_DEV_ONE]
} else {
    console.log("prod!!");
    webOrigin = process.env.WEB_APP_URL_PROD
}

const corsOptions = {
    credentials: true,
    origin: webOrigin,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
export const app = express();

// helps you secure your Express apps by setting various HTTP headers
app.use(cors(corsOptions))
app.use(helmet());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'))


app.use(express.static('public'));
//מגדיר את המידע בבקשה בתור גייסון
// app.use(express.json())
app.use(
    express.json({
        verify: (req, res, buffur) => (req["rawBody"] = buffur),
    })
);
app.use(compression())
app.use(cookieParser())

app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Credentials', true);
    console.log("cookie", req.cookies)
    next()
})



app.use('/booking', bookingRouter)
app.use('/books', bookRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use("/webhook", webhookRouter);



//במידה והכתובת לא קיימת ובעצם לא נתפסת באף אחד מהכתבות למעלה
//אז כל הכתובות ייתפסו במיידלוואר הזה ויציגו את השגיאה
app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404))
})


app.use(globalErrorHandlerNew);
