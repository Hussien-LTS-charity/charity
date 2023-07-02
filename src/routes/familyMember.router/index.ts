import express, { Router } from "express";
import {
  httpAddFamilyMemberHandler,
  httpDeleteFamilyMemberHandler,
  httpEditFamilyMemberHandler,
  httpGetAllFamilyMembersHandler,
  httpGetSpecificFamilyMemberHandler,
} from "../../controllers/familyMember.controller";

const familyMemberRouter: Router = express.Router();

familyMemberRouter.post("/", httpAddFamilyMemberHandler);
familyMemberRouter.get("/", httpGetAllFamilyMembersHandler);
familyMemberRouter.get("/:familyMemberId", httpGetSpecificFamilyMemberHandler);
familyMemberRouter.put("/:familyMemberId", httpEditFamilyMemberHandler);
familyMemberRouter.delete("/:familyMemberId", httpDeleteFamilyMemberHandler);

export default familyMemberRouter;
