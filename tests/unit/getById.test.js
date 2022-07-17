// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

const { Fragment } = require('../../src/model/fragment');

const hash = require('../../src/hash');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/abc').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/abc')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users get a fragment object by id', async () => {
    const fragment = new Fragment({
      ownerId: hash('user1@email.com'),
      type: 'text/plain',
      size: 0,
    });
    await fragment.save();
    await fragment.setData(Buffer.from('a'));
    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.metadata.size).toBe(1);
    expect(res.body.fragment.data).toBe('a');
  });

  test('get text/plain fragment with charset data', async () => {
    const fragment = new Fragment({
      ownerId: hash('user1@email.com'),
      type: 'text/plain; charset=utf-8',
      size: 0,
    });
    await fragment.save();
    await fragment.setData(Buffer.from('a'));
    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.metadata.size).toBe(1);
    expect(res.body.fragment.metadata.type).toBe('text/plain; charset=utf-8');
    expect(res.body.fragment.data).toBe('a');
  });

  test('convert fragment of type .md to .html', async () => {
    const fragment = new Fragment({
      ownerId: hash('user1@email.com'),
      type: 'text/plain; charset=utf-8',
      size: 0,
    });
    await fragment.save();
    await fragment.setData(Buffer.from('# This is a header'));
    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}.md`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.metadata.type).toBe('text/plain; charset=utf-8');
    expect(res.body.fragment.metadata.id).toBe(fragment.id);
    expect(res.body.fragment.data).toContain('<h1>This is a header</h1>');
  });

  test('get data of type application/json', async () => {
    const fragment = new Fragment({
      ownerId: hash('user1@email.com'),
      type: 'application/json',
      size: 0,
    });
    await fragment.save();
    await fragment.setData(Buffer.from(JSON.stringify({ city: 'Madrid', number: 11 })));
    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.metadata.type).toBe('application/json');
    expect(res.body.fragment.metadata.id).toBe(fragment.id);
    expect(res.body.fragment.data.city).toBe('Madrid');
    expect(res.body.fragment.data.number).toBe(11);
  });

  test('fragment not found', async () => {
    const res = await request(app).get(`/v1/fragments/123`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
