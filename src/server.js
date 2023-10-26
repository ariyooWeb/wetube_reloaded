import "./db";
import "./models/video";
import express from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter"
import userRouter from "./routers/userRouter"
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddelware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine","pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended:true}));
app.use(express.json());

console.log(process.env.COOKIE_SECRET);

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie:{
            maxAge:60*60*24*10000
        },
        store: MongoStore.create({mongoUrl:process.env.DB_URL})
    })
);

app.use(localsMiddelware);
app.use("/uploads", express.static("uploads"))
app.use("/static", express.static("assets"))
app.use("/",rootRouter);
app.use("/users",userRouter);
app.use("/videos",videoRouter);
app.use("/api", apiRouter);


export default app;