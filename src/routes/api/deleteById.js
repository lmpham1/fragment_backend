// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  let id = req.params.id;
  try {
    await Fragment.delete(req.user, id);
    res.status(200).json(createSuccessResponse(id));
  } catch (err) {
    console.log(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
