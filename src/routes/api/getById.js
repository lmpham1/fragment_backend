// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const id = req.params.id;
  try {
    const fragment = await Fragment.byId(req.user, id);
    if (fragment) {
      let data = await fragment.getData();
      switch (fragment.mimeType) {
        case 'text/plain': {
          const type = fragment.type;
          let charset = undefined;
          if (type.includes('charset=')) {
            charset = fragment.type.substr(fragment.type.search(/(?<=charset=).*$/g));
          }
          data = data.toString(charset);
          break;
        }
        case 'application/json':
          data = JSON.parse(data.toString());
          break;
      }
      res.status(200).json(
        createSuccessResponse({
          fragment: {
            metadata: fragment,
            data: data,
          },
        })
      );
    }
  } catch (err) {
    console.log(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
