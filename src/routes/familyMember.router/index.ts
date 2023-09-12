import express, { Router } from "express";
import {
  httpAddFamilyMemberHandler,
  httpDeleteFamilyMemberHandler,
  httpEditFamilyMemberHandler,
  httpGetAllFamilyMembersHandler,
  httpGetSpecificFamilyMemberHandler,
} from "../../controllers/familyMember.controller";

const familyMemberRouter: Router = express.Router();

familyMemberRouter.post("/:familyId", httpAddFamilyMemberHandler);
familyMemberRouter.get("/:familyId", httpGetAllFamilyMembersHandler);
familyMemberRouter.get("/:familyId/:familyMemberId", httpGetSpecificFamilyMemberHandler);
familyMemberRouter.put("/:familyId/:familyMemberId", httpEditFamilyMemberHandler);
familyMemberRouter.delete("/:familyId/:familyMemberId", httpDeleteFamilyMemberHandler);

export default familyMemberRouter;
