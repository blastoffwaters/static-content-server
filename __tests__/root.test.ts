import { describe, expect } from '@jest/globals';
import { app, startServer, getPublicFolderContents } from '../app';
import supertest, { Response } from 'supertest';
import { Server } from 'http';

describe("GET /json", () => {
  it("should listen on port 6677 and return the proper data", async () => {
    const server: Server = startServer();
    const res: Response = await supertest(app).get(`/json`);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).server).toBe("Static File Server");
    expect(JSON.parse(res.text).version).toBe("jest-testing");
    const files = getPublicFolderContents();
    files.forEach(file => {
      expect(JSON.parse(res.text).files).toContain(file);
    });
    server.close();
  });
});

describe("GET /", () => {
  it("should return the user-viewable HTML with a list of files and links to them", async () => {
    const res: Response = await supertest(app).get(`/`);
    expect(res.statusCode).toBe(200);
    const files = getPublicFolderContents();
    files.forEach(file => {
      const fileLink = `<a href="${file}">${file}</a>`;
      expect(res.text).toContain(fileLink);
    });
  });
});