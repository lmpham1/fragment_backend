// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  console.log(req.body);
  const fragmentValue = req.body;
  console.log(fragmentValue);
  const fragment = new Fragment({ownerId: '1234', type: 'text/plain', size:1})
  await fragment.save();
  await fragment.setData(fragmentValue);
  // TODO: this is just a placeholder to get something working...
  res.status(200).location(process.env.API_URL + "/" + fragment.id).json(
    createSuccessResponse(fragment)
  );
};
