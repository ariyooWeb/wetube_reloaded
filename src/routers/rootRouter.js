import express from "express";
import {getJoin, postJoin, getLogin, postLogin} from "../controller/userController";
import {home, search} from "../controller/videoController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();


rootRouter.get("/",home);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.get("/search",search);

export default rootRouter;
