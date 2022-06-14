const MemoryDB = require('./memory-db');

// Create two in-memory databases: one for fragment metadata and the other for raw data
const data = new MemoryDB();
const metadata = new MemoryDB();

// Write a fragment's metadata to memory db. Returns a Promise
function writeFragment(fragment) {
  return metadata.put(fragment.ownerId, fragment.id, fragment).then().catch(err => console.log(err));
}

// Read a fragment's metadata from memory db. Returns a Promise
function readFragment(ownerId, id) {
  return metadata.get(ownerId, id).then().catch(err => console.log(err));
}

// Write a fragment's data to memory db. Returns a Promise
function writeFragmentData(ownerId, id, value) {
  if (value === undefined){
    throw new Error("Buffer cannot be empty");
  }
  return data.put(ownerId, id, value).then().catch(err => console.log(err));
}

// Read a fragment's data from memory db. Returns a Promise
function readFragmentData(ownerId, id) {
  return data.get(ownerId, id).then().catch(err => console.log(err));
}

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
async function listFragments(ownerId, expand = false) {
  const fragments = await metadata.query(ownerId);

  // If we don't get anything back, or are supposed to give expanded fragments, return
  if (expand || !fragments) {
    return fragments;
  }

  // Otherwise, map to only send back the ids
  return fragments.map((fragment) => fragment.id);
}

// Delete a fragment's metadata and data from memory db. Returns a Promise
function deleteFragment(ownerId, id) {
  return Promise.all([
    // Delete metadata
    metadata.del(ownerId, id),
    // Delete data
    data.del(ownerId, id),
  ]);
}

module.exports.listFragments = listFragments;
module.exports.writeFragment = writeFragment;
module.exports.readFragment = readFragment;
module.exports.writeFragmentData = writeFragmentData;
module.exports.readFragmentData = readFragmentData;
module.exports.deleteFragment = deleteFragment;
