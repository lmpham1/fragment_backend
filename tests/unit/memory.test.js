// Fix this path to point to your project's `memory-db.js` source file
//const MemoryDB = require('../../src/model/data/memory/memory-db');

const {
  writeFragment,
  readFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
} = require('../../src/model/data');

const { Fragment } = require('../../src/model/fragment');

describe('memory/index.js', () => {
  test('writeFragment() returns nothing', async () => {
    const metadata = new Fragment({ ownerId: 'a', id: 'b', type: 'text/plain', size: 1 });
    const result = await writeFragment(metadata);
    expect(result).toBe(undefined);
  });

  test('readFragment() returns what we writeFragment() into the db', async () => {
    const metadata = new Fragment({ ownerId: 'a', id: 'b', type: 'text/plain', size: 1 });
    await writeFragment(metadata);
    const result = await readFragment('a', 'b');
    expect(result).toEqual(metadata);
  });

  test('readFragment() with incorrect ownerId returns nothing', async () => {
    const metadata = new Fragment({ ownerId: 'a', id: 'b', type: 'text/plain', size: 1 });
    await writeFragment(metadata);
    const result = await readFragment('c', 'b');
    expect(result).toBe(undefined);
  });

  test('readFragment() with incorrect id returns nothing', async () => {
    const metadata = new Fragment({ ownerId: 'a', id: 'b', type: 'text/plain', size: 1 });
    await writeFragment(metadata);
    const result = await readFragment('a', 'c');
    expect(result).toBe(undefined);
  });

  test('writeFragmentData() returns nothing', async () => {
    const result = await writeFragmentData('a', 'b', 'A');
    expect(result).toBe(undefined);
  });

  test('writeFragmentData() attempt to write an empty object', async () => {
    expect(() => writeFragmentData('a', 'b', undefined)).toThrow();
  });

  test('readFragmentData() returns what we writeFragmentData() into the db', async () => {
    await writeFragmentData('a', 'b', 'A');
    const result = await readFragmentData('a', 'b');
    expect(result).toEqual('A');
  });

  test('listFragments() returns all fragments for a user', async () => {
    const data = new Fragment({ ownerId: 'b', id: 'a', type: 'text/plain', size: 1 });
    await writeFragment(data);
    await writeFragmentData('b', 'a', 'A');
    const result = await listFragments('b');
    expect(result[0]).toEqual('a');
    const expandedResult = await listFragments('b', true);
    expect(expandedResult[0].id).toEqual('a');
  });
});
