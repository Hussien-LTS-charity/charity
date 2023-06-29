// src/app.ts
import express, { Request, Response } from "express";
import morgan from "morgan";
import familyRouter from "./routes/familyRouter";
import FamilyMemberRouter from "./routes/FamilyMember";

export const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  console.log("in world");

  res.send("Hello, world!");
});
app.use("/api/family", familyRouter);
app.use("/api/family-member", FamilyMemberRouter);
