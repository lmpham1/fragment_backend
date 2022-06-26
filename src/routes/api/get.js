// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const expand = req.query.expand;
  const fragments = await Fragment.byUser(req.user, expand);
  if (fragments)
    res.status(200).json(
      createSuccessResponse({
        fragments: fragments,
      })
    );
};
