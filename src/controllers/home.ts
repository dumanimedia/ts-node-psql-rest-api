import { Request, Response } from "express";

const serverIndexRoute = async (req: Request, res: Response) => {
  res.json({
    message:
      "Welcome to the 'ts-node-psql-rest-api' server, it's nice to have you here",
  });
};

export default {
  serverIndexRoute,
};
