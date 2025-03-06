import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 6677;

app.get("/", (req: Request, res: Response) => {
  const files = getPublicFolderContents();
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Static Files</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  </head>
  <body>
    <h1>Static Files</h1>
    <ul>
      ${files.map(file => `
        <li>
          <i class="fas fa-fw fa-file"></i>
          <a href="${file}">${file}</a>
        </li>
      `).join('')}
    </ul>
  </body>
  </html>
  `);
});

app.get("/json", (req: Request, res: Response) => {
  res.contentType("application/json");
  res.json({
    server: "Static File Server",
    version: "DEV (not implemented)",
    github_repo: "https://github.com/blastoffwaters/static-content-server",
    files: getPublicFolderContents()
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

app.use(express.static('public', { cacheControl: true, setHeaders: function(res, path) { 
  res.setHeader("Cache-Control","max-age=86400, public");
}}));

if (process.env.NODE_ENV !== "test") { startServer(); }

export function startServer() {
  return app.listen(port, () => {
    console.log(`[server] Server is running at http://localhost:${port}`);
  });
}

export function getPublicFolderContents() {
  const publicFolderContents: string[] = [];
  const entries = fs.readdirSync("public", {recursive: true, withFileTypes: true});
  for (const entry of entries) {
    if (entry.isDirectory()) continue;
    publicFolderContents.push(entry.parentPath.replace(/public\//g, "") + "/" + entry.name);
  }
  return publicFolderContents;
}
