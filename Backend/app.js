import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import bodyParser from 'body-parser';
import AdminRouter from './src/routes/AdminRoute.js'
import UserRouter from "./src/routes/UserRoute.js";
import ReportRouter from "./src/routes/Reports.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get('/',(req,res)=>{
    console.log("somecone is calling hai sathy")
    return res.send("prateek iz gay")
})

app.use('/admin',AdminRouter)
app.use('/report',ReportRouter)
app.use('/user',UserRouter)

export default app