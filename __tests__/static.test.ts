import { describe, expect } from '@jest/globals';
import { app } from '../src/app.ts';
import supertest, { Response } from 'supertest';

describe("GET /json", () => {
  it("should listen on port 6677 and return the proper data", async () => {
    const res: Response = await supertest(app).get(`/README.txt`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Static Content Server by Bow\nGitHub Repo: https://github.com/blastoffwaters/static-content-server\nThis server is not operated by Bow. If you have complaints about the contents, direct them to the webmaster of this server.");
  });
})