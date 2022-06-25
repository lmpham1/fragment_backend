// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragmentValue = req.body;
  const fragment = new Fragment({ ownerId: req.user, type: req.headers['content-type'] });
  if (!Fragment.isSupportedType(fragment.type)) {
    res
      .status(415)
      .json(createErrorResponse(415, `Data of type ${fragment.type} is not supported`));
  }
  await fragment.save();
  await fragment.setData(fragmentValue);
  // TODO: this is just a placeholder to get something working...
  res
    .status(201)
    .location(process.env.API_URL + '/' + fragment.id)
    .json(createSuccessResponse(fragment));
};
