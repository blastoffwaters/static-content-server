import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 6677;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.contentType("application/json");
  res.json({
    server: "Static File Server",
    accessing_on: req.hostname,
    version: "DEV (not implemented)",
    github_repo: "https://github.com/blastoffwaters/static-content-server",
    auth_valid: (req.headers['authorization'] === `Bearer ${process.env.API_KEY}`),
  });
});

app.get("/healthz", (req: Request, res: Response) => {
  res.contentType("application/json");
  res.json({
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date()
  });
});

app.use(express.static('public'));

if (process.env.NODE_ENV !== "test") { startServer(); }

export function startServer() {
  return app.listen(port, () => {
    console.log(`[server] Server is running at http://localhost:${port}`);
  });
}
