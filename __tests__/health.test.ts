import { describe, expect } from '@jest/globals';
import { app } from '../app';
import supertest, { Response } from 'supertest';

describe("GET /healthz", () => {
  it("should report a valid health status", async () => {
    const res: Response = await supertest(app).get(`/healthz`);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).uptime).toBeDefined();
    expect(JSON.parse(res.text).message).toBe("Ok");
    expect(new Date(JSON.parse(res.text).date)).toBeInstanceOf(Date);
  });
});