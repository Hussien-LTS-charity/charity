import express, { Router } from "express";
import {
  httpAddFamilyMemberHealthHistoryHandler,
  httpGetSpecificFamilyMemberHealthHistoryHandler,
  httpGetAllFamilyMembersHealthHistoryHandler,
  httpEditFamilyMemberHealthHistoryHandler,
  httpDeleteFamilyMemberHealthHistoryHandler,
} from "../../controllers/healthHistory.controller";

const healthHistoryRouter: Router = express.Router();

healthHistoryRouter.post(
  "/:familyMemberId",
  httpAddFamilyMemberHealthHistoryHandler
);
healthHistoryRouter.get(
  "/:familyMemberId",
  httpGetSpecificFamilyMemberHealthHistoryHandler
);
healthHistoryRouter.get("/", httpGetAllFamilyMembersHealthHistoryHandler);
healthHistoryRouter.put(
  "/:familyMemberId",
  httpEditFamilyMemberHealthHistoryHandler
);
healthHistoryRouter.delete(
  "/:familyMemberId",
  httpDeleteFamilyMemberHealthHistoryHandler
);

export default healthHistoryRouter;
