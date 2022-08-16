// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    let id = req.params.id;
    const fragmentValue = req.body;
    const fragment = await Fragment.byId(req.user, id);
    await fragment.setData(fragmentValue);
    await fragment.save();
    // TODO: this is just a placeholder to get something working...
    res
      .status(201)
      .location(process.env.API_URL + '/v1/fragments/' + fragment.id)
      .json(createSuccessResponse(fragment));
  } catch (err) {
    console.log(err);
    res.status(415).json(createErrorResponse(415, err));
  }
};
