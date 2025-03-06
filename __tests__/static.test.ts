import { describe, expect } from '@jest/globals';
import { app } from '../app';
import supertest, { Response } from 'supertest';

describe("GET /README.txt", () => {
  it("should get the contents of the static file", async () => {
    const res: Response = await supertest(app).get(`/README.txt`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Static Content Server by Bow\nGitHub Repo: https://github.com/blastoffwaters/static-content-server\nThis server is not operated by Bow. If you have complaints about the contents, direct them to the webmaster of this server.");
  });
})