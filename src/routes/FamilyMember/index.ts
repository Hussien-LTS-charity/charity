import express, { Router } from "express";
import {
  httpAddFamilyMemberHandler,
  httpDeleteFamilyMemberHandler,
  httpEditFamilyMemberHandler,
  httpGetAllFamilyMembersHandler,
  httpGetSpecificFamilyMemberHandler,
} from "../../controllers/FamilyMember.controller";

const FamilyMemberRouter: Router = express.Router();

FamilyMemberRouter.post("/", httpAddFamilyMemberHandler);
FamilyMemberRouter.get(
  "/:familyId/all-family-members",
  httpGetAllFamilyMembersHandler
);
FamilyMemberRouter.get(
  "/:familyId/:familyMemberId",
  httpGetSpecificFamilyMemberHandler
);
FamilyMemberRouter.put(
  "/:familyId/:familyMemberId",
  httpEditFamilyMemberHandler
);
FamilyMemberRouter.delete(
  "/:familyId/:familyMemberId",
  httpDeleteFamilyMemberHandler
);

export default FamilyMemberRouter;
