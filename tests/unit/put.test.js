// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
const hash = require('../../src/hash');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).put('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('successful PUT request updates data and returns updated metadata', async () => {
    const fragment = new Fragment({
      ownerId: hash('user1@email.com'),
      type: 'text/plain',
      size: 0,
    });
    fragment.setData('abc');
    fragment.save();
    const putResult = await request(app)
      .put(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1')
      .send('updated')
      .set('Content-type', 'text/plain');
    expect(putResult.statusCode).toBe(200);
    expect(putResult.body.size).toBe(7);
    const getResult = await request(app)
      .get(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(getResult.statusCode).toBe(200);
    expect(getResult.text).toBe('updated');
  });

  test('update non-existent fragment', async () => {
    const putResult = await request(app)
      .put(`/v1/fragments/abc`)
      .auth('user1@email.com', 'password1')
      .send('updated')
      .set('Content-type', 'text/plain');
    expect(putResult.statusCode).toBe(404);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
