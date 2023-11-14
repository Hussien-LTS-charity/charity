// src/app.ts
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import familyRouter from "./routes/family.router";
import familyMemberRouter from "./routes/familyMember.router";
import healthHistoryRouter from "./routes/healthHistory.router";
import memberNeedsRouter from "./routes/memberNeeds.router";
import donorRouter from "./routes/donor.router";
import donationRouter from "./routes/donation.router";

export const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});
app.use("/api/family", familyRouter);
app.use("/api/family-member", familyMemberRouter);
app.use("/api/health-history", healthHistoryRouter);
app.use("/api/member-needs", memberNeedsRouter);
app.use("/api/donor", donorRouter);
app.use("/api/donation", donationRouter);
