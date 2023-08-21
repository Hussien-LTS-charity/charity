import express, { Router } from "express";
import { httpAddHealthHistoryHandler, httpDeleteHealthHistoryHandler, httpEditHealthHistoryHandler, httpGetAllHealthHistoryHandler, httpGetSpecificHealthHistoryHandler } from "../../controllers/healthHistory.controller";

const healthHistoryRouter: Router = express.Router();

healthHistoryRouter.post(
  "/:familyId/:familyMemberId",
  httpAddHealthHistoryHandler
);
healthHistoryRouter.get(
  "/:familyId/:familyMemberId",
  httpGetSpecificHealthHistoryHandler
);
healthHistoryRouter.get("/:familyId", httpGetAllHealthHistoryHandler);
healthHistoryRouter.put(
  "/:familyId/:familyMemberId/:healthHistoryId",
  httpEditHealthHistoryHandler
);
healthHistoryRouter.delete(
  "/:familyId/:familyMemberId/:healthHistoryId",
  httpDeleteHealthHistoryHandler
);

export default healthHistoryRouter;
