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
familyRouter.get("/:id", httpGetFamilyHandler);
familyRouter.put("/:id", httpEditFamilyHandler);
familyRouter.delete("/:id", httpDeleteFamilyHandler);

export default familyRouter;
