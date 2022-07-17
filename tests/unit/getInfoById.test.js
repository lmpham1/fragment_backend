// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

const { Fragment } = require('../../src/model/fragment');

const hash = require('../../src/hash');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/abc/info').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/abc/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users get a fragment object by id', async () => {
    const fragment = new Fragment({
      ownerId: hash('user1@email.com'),
      type: 'text/plain; charset=utf-8',
      size: 0,
    });
    await fragment.save();
    await fragment.setData(Buffer.from('a'));
    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}/info`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.id).toBe(fragment.id);
    expect(res.body.size).toBe(1);
  });

  test('fragment not found', async () => {
    const res = await request(app)
      .get(`/v1/fragments/123/info`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
