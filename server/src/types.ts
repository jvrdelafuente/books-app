import { Request, Response } from "express";

// This is used to add our own properties to the session
declare module "express-session" {
  export interface SessionData {
    userId?: number;
  }
}

export type MyContext = {
  req: Request;
  res: Response;
};
