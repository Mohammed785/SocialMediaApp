import { Router } from "express";
import {getAllStatus,getAvailableStatus,getStatusViews,createStatus,deleteStatus,viewStatus} from "../controllers/status"
import { uploader } from "../utils";


export const statusRouter = Router()


statusRouter.get("/available",getAvailableStatus)
statusRouter.get("/author/",getAllStatus)
statusRouter.post("/create",uploader.single("image"),createStatus)
statusRouter.delete("/:id/delete",deleteStatus)
statusRouter.post("/:id/view",viewStatus)
statusRouter.get("/:id/views",getStatusViews)