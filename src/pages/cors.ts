import { NextFunction, Request, Response } from "express";
export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedOrigins = ["http://localhost:3000"];
  const origin = req.headers.origin as string;
  if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
    } else {
      next();
    }
  } else {
    res.status(403).json({ message: "Not allowed by CORS" });
  }
};