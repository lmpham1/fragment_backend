const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const supportedType = [
  'text/plain'
]

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    // TODO
    if (ownerId === undefined){
      throw new Error('onwerId is required');
    }

    if (type === undefined){
      throw new Error('type is required');
    }

    if (typeof size != 'number' || size < 0){
      throw new Error('size must be a number and is 0 or higher');
    }

    if (!Fragment.isSupportedType(type)){
      throw new Error(`data type '${type}' is not supported`);
    }

    this.id = id ? id : randomUUID();
    this.ownerId = ownerId;
    this.created = created ? created : new Date();
    this.updated = updated ? updated : new Date();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
    try{
      const fragments = await listFragments(ownerId, expand);
      return fragments;
    } catch(err) {
      console.log(err)
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO
    try{
      const fragment = await readFragment(ownerId, id);
      return fragment;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    // TODO
    try {
    return deleteFragment(ownerId, id);
    } catch (err){
      console.log(err);
    }
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    // TODO
    try {
      return writeFragment(this)
    } catch (err) {
      console.log(err);
    };
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    // TODO
    try {
    const result = await readFragmentData(this.ownerId, this.id);
    return result;
    } catch(err) {
      console.log(err)
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    // TODO
    try {
      return writeFragmentData(this.ownerId, this.id, data);
    } catch(err) {
      console.log(err);
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    // TODO
    return this.type.substring(0, 5) === 'text/'
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    let resultingTypes = []
    // TODO
    for (let i = 0; i < supportedType.length; ++i){
      if (this.type.includes(supportedType[i])){
        resultingTypes.push(supportedType[i])
      }
    }
    return resultingTypes;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // TODO
    for (let i = 0; i < supportedType.length; ++i){
      if (value.includes(supportedType[i]))
        return true;
    }
    return false;
  }
}

module.exports.Fragment = Fragment;
