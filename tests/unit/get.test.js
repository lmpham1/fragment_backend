// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

const { Fragment } = require('../../src/model/fragment');

const hash = require('../../src/hash');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(0);
  });

  test('authenticated users get a fragments array with one fragment', async () => {
    const fragment = new Fragment({
      ownerId: hash('user1@email.com'),
      type: 'text/plain',
      size: 0,
    });
    await fragment.save();
    await fragment.setData(Buffer.from('abc'));
    const res = await request(app).get(`/v1/fragments`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments.length).toBe(1);
    expect(res.body.fragments[0]).toBe(fragment.id);
  });

  test('authenticated users get a fragments array with one fragment with expand=1', async () => {
    const res = await request(app)
      .get(`/v1/fragments?expand=1`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments.length).toBe(1);
    expect(res.body.fragments[0].ownerId).toBe(hash('user1@email.com'));
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
