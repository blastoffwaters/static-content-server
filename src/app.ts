import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { readdirSync } from "fs";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 6677;

app.get("/", (req: Request, res: Response) => {
  const files = JSON.parse(getPublicFolderContents());
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
      ${Object.keys(files).map(file => `
        <li>
          <i class="fas fa-fw ${files[file] === 'file' ? 'fa-file' : 'fa-folder'}"></i>
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
    files: JSON.parse(getPublicFolderContents())
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
  res.setHeader("Cache-Control","max-age=86400,");
}}));

if (process.env.NODE_ENV !== "test") { startServer(); }

export function startServer() {
  return app.listen(port, () => {
    console.log(`[server] Server is running at http://localhost:${port}`);
  });
}

export function getPublicFolderContents() {
  const publicFolderContents: { [name: string]: 'file' | 'folder' } = {};
  const entries = readdirSync('public', { withFileTypes: true });
  for (const entry of entries) {
    publicFolderContents[entry.name] = entry.isDirectory() ? 'folder' : 'file';
  }
  return JSON.stringify(publicFolderContents, null, 2);
}
