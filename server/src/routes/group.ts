import { Router } from "express";
import {searchGroups,getGroup,getGroupMembers,getGroupRequests,getUserGroups,declineGroupRequest,deleteGroup,
    cancelGroupRequest,createGroup,acceptGroupRequest,joinGroup,leaveGroup,kickGroupMember,editGroup,checkIsMember,
} from "../controllers/group";
import { CreateGroupDTO } from "../@types/group";
import { validationMiddleware } from "../middleware";
import { uploader } from "../utils";

export const groupRouter = Router();

groupRouter.get("/search", searchGroups);
groupRouter.get("/user", getUserGroups);
groupRouter.post("/create",uploader.single("image"),validationMiddleware(CreateGroupDTO),createGroup);
groupRouter.patch("/update/:id", uploader.single("image"), editGroup);
groupRouter.delete("/delete/:id", deleteGroup);
groupRouter.get("/:id", getGroup);

groupRouter.get("/:id/request/all", getGroupRequests);
groupRouter.delete("/:groupId/request/:userId/accept", acceptGroupRequest);
groupRouter.delete("/:groupId/request/:userId/decline", declineGroupRequest);
groupRouter.delete("/:id/request/cancel", cancelGroupRequest);

groupRouter.get("/:id/member", checkIsMember);
groupRouter.get("/:id/member/all", getGroupMembers);
groupRouter.post("/:id/join", joinGroup);
groupRouter.delete("/:id/member/leave", leaveGroup);
groupRouter.delete("/:groupId/member/:userId/kick", kickGroupMember);
