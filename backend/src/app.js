import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "16kb" })); //in forms
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //from url
app.use(express.static("public")); //some assets which can be seen by everyone
app.use(cookieParser());

//routers import 
import customerRouter from "./routes/customer.route.js"
app.use("/api/customers", customerRouter)

export { app };

