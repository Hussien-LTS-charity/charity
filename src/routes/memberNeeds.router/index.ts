import express, { Router } from "express";
import {
  httpAddMemberNeedsHandler,
  httpGetSpecificMemberNeedsHandler,
  httpGetAllMembersNeedsHandler,
  httpEditMemberNeedsHandler,
  httpDeleteMemberNeedsHandler,
} from "../../controllers/memberNeeds.controller";

const memberNeedsRouter: Router = express.Router();

memberNeedsRouter.post("/:familyId/:familyMemberId", httpAddMemberNeedsHandler);
memberNeedsRouter.get("/:familyId/:familyMemberId", httpGetSpecificMemberNeedsHandler);
memberNeedsRouter.get("/:familyId", httpGetAllMembersNeedsHandler);
memberNeedsRouter.put("/:familyId/:familyMemberId/:memberNeedId", httpEditMemberNeedsHandler);
memberNeedsRouter.delete("/:familyId/:familyMemberId/:memberNeedId", httpDeleteMemberNeedsHandler);

export default memberNeedsRouter;
