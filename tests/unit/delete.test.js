// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
const hash = require('../../src/hash');

describe('DELETE /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('successful delete request', async () => {
    const fragment = new Fragment({
      ownerId: hash('user1@email.com'),
      type: 'text/plain',
      size: 0,
    });
    await fragment.save();
    await fragment.setData(Buffer.from('a'));
    const result = await request(app)
      .get(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(result.statusCode).toBe(200);
    expect(result.text).toBe('a');
    const deleteResult = await request(app)
      .delete(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(deleteResult.statusCode).toBe(200);
    expect(deleteResult.body.id).toBe(fragment.id);
    const postDeleteResult = await request(app)
      .get(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(postDeleteResult.statusCode).toBe(404);
  });

  test('delete non-existent fragment', async () => {
    const deleteResult = await request(app)
      .delete(`/v1/fragments/abc`)
      .auth('user1@email.com', 'password1');
    expect(deleteResult.statusCode).toBe(404);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
