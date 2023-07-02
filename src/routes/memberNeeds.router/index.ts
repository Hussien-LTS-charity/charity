import express, { Router } from "express";
import {
  httpAddMemberNeedsHandler,
  httpGetSpecificMemberNeedsHandler,
  httpGetAllMembersNeedsHandler,
  httpEditMemberNeedsHandler,
  httpDeleteMemberNeedsHandler,
} from "../../controllers/memberNeeds.controller";

const memberNeedsRouter: Router = express.Router();

memberNeedsRouter.post("/:familyMemberId", httpAddMemberNeedsHandler);
memberNeedsRouter.get("/:familyMemberId", httpGetSpecificMemberNeedsHandler);
memberNeedsRouter.get("/", httpGetAllMembersNeedsHandler);
memberNeedsRouter.put("/:familyMemberId", httpEditMemberNeedsHandler);
memberNeedsRouter.delete("/:familyMemberId", httpDeleteMemberNeedsHandler);

export default memberNeedsRouter;
