import express, { Router } from "express";
import {
  httpAddFamilyHandler,
  httpDeleteFamilyHandler,
  httpEditFamilyHandler,
  httpGetAllFamiliesHandler,
  httpGetFamilyHandler,
} from "../../controllers/family.controller";

const familyRouter: Router = express.Router();

familyRouter.post("/", httpAddFamilyHandler);
familyRouter.get("/", httpGetAllFamiliesHandler);
familyRouter.get("/:familyId", httpGetFamilyHandler);
familyRouter.put("/:familyId", httpEditFamilyHandler);
familyRouter.delete("/:familyId", httpDeleteFamilyHandler);

export default familyRouter;
