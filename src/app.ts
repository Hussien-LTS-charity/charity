// src/app.ts
import express, { Request, Response } from "express";
import morgan from "morgan";
import familyRouter from "./routes/family.router";
import familyMemberRouter from "./routes/familyMember.router";
import healthHistoryRouter from "./routes/familyMemberHealthHistory.router";
import memberNeedsRouter from "./routes/memberNeeds.router";
import donorRouter from "./routes/donor.router";

export const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});
app.use("/api/family", familyRouter);
app.use("/api/family-member", familyMemberRouter);
app.use("/api/health-history/:familyId", healthHistoryRouter);
app.use("/api/member-needs/:familyId", memberNeedsRouter);
app.use("/api/donor/", donorRouter);
