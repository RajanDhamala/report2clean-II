
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import AdminRouter from './src/routes/AdminRoute.js';
import UserRouter from "./src/routes/UserRoute.js";
import ReportRouter from "./src/routes/Reports.js";

const app = express();

// ------------------- ES module fix for __dirname -------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------- Middlewares -------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ------------------- EJS setup -------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// ------------------- Routes -------------------
app.get('/', (req, res) => {
    console.log("Someone is calling /");
    return res.send("Hello from backend!");
});

app.use('/admin', AdminRouter);   // SSR admin routes
app.use('/report', ReportRouter); // API report routes
app.use('/user', UserRouter);     // API user routes

// ------------------- Export app -------------------
export default app;

