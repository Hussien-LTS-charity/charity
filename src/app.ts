// src/app.ts
import express, { Request, Response } from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

export default app;
