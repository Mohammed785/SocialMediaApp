import { Router } from "express"
import {getBlockList,getFriendList,getFriendRequestHistory,getFriendRequests,isRelatedTo,blockUser,unfriendUser,
sendFriendRequest,acceptFriendRequest,declineFriendRequest,cancelFriendRequest,unblockUser} from "../controllers/relation"

export const relationRouter = Router()

relationRouter.get("/request",getFriendRequests)
relationRouter.get("/request/history",getFriendRequestHistory)
relationRouter.post("/request/send/:id",sendFriendRequest)
relationRouter.post("/request/accept/:id",acceptFriendRequest)
relationRouter.post("/request/decline/:id",declineFriendRequest)
relationRouter.post("/request/cancel/:id",cancelFriendRequest)
relationRouter.get("/friend/list/:id",getFriendList)
relationRouter.post("/unfriend/:id",unfriendUser)
relationRouter.get("/block/list",getBlockList)
relationRouter.get("/related/:id",isRelatedTo)
relationRouter.post("/block/:id",blockUser)
relationRouter.post("/unblock/:id",unblockUser)
