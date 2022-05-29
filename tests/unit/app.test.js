// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('app.js 404 test', () => {
  test('request that cause 404 response', async () => {
    const res = await request(app).get('/404');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('not found');
  });
});
