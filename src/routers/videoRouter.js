import express from "express";
import {
    getEdit, 
    postEdit, 
    watch, 
    getUpload,
    postUpload,
    deleteVideo
} from "../controller/videoController";
import { localsMiddelware, protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.route("/:id([0-9a-f]{24})").all(localsMiddelware).get(watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.single("video"), postUpload);

export default videoRouter;
