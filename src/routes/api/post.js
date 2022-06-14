// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const fragmentValue = req.body;
    const fragment = new Fragment({ ownerId: '1234', type: req.headers['content-type'] });
    if (!Fragment.isSupportedType(fragment.type)) {
      throw new Error(`data of type ${fragment.type} is unsupported!`);
    }
    await fragment.save();
    await fragment.setData(fragmentValue);
    // TODO: this is just a placeholder to get something working...
    res
      .status(200)
      .location(process.env.API_URL + '/' + fragment.id)
      .json(createSuccessResponse(fragment));
  } catch (err) {
    res.status(415).json(createErrorResponse(415, err));
  }
};
