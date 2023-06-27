// src/app.ts
import express, { Request, Response } from "express";
import morgan from "morgan";
import familyRouter from "./routes/familyRouter";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.get("/api/family", familyRouter);

export default app;
