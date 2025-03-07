import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import escape from "escape-html";
import { Server } from "http";

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
    <style>
      body {
        background-color: #ccc;
        font-family: Arial, sans-serif;
      }
      h1 {
        margin: 1em 0;
        text-align: center;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        padding: 1em;
        border-bottom: 1px solid black;
      }
      li:last-child {
        border-bottom: none;
      }
      a {
        text-decoration: none;
        color: #00698f;
      }
      a:hover {
        text-decoration: underline;
      }
      i {
        color: #666;
      }
    </style>
  </head>
  <body>
    <h1>Files</h1>
    <ul>
      ${files.map(file => `
        <li>
          <i class="fas fa-fw fa-file"></i>
          <a href="${escape(file)}">${escape(file)}</a>
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
    version: process.env.IMAGE_TAG || "No Version Available",
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

app.use(express.static('public', { cacheControl: true, setHeaders: function(res) { 
  res.setHeader("Cache-Control","max-age=86400, public");
}}));

if (process.env.NODE_ENV !== "test") { 
  const server: Server = startServer(); 
  process.on('SIGTERM', () => {
    console.log('[server] SIGTERM signal received: closing Static Content Server')
    server.close(() => {
      console.log('[server] HTTP server closed')
    })
  })
}

export function startServer(): Server {
  return app.listen(port, () => {
    console.log(`[server] Static Content Server is running at http://localhost:${port}`);
    console.log(`[server] Version ${process.env.IMAGE_TAG || "(unavailable)"} by Blast Off Waters`);
  });
}

export function getPublicFolderContents() {
  const publicFolderContents: string[] = [];
  const entries = fs.readdirSync("public", { recursive: true, withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) continue;
    const path = entry.parentPath + "/" + entry.name;
    if (path.startsWith("public/")) {
      publicFolderContents.push(path.substring("public/".length));
    }
  }
  return publicFolderContents;
}
