// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const md = require('markdown-it')();
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  let id = req.params.id;
  let isMarkdown = false;
  if (id.endsWith('.md')) {
    id = id.substr(0, id.search(/\.[A-Za-z]+$/));
    isMarkdown = true;
  }
  try {
    const fragment = await Fragment.byId(req.user, id);
    let data = await fragment.getData();
    const mimeType = fragment.mimeType;
    if (mimeType.startsWith('text/')) {
      const type = fragment.type;
      let charset = undefined;
      if (type.includes('charset=')) {
        charset = fragment.type.substr(fragment.type.search(/(?<=charset=).*$/g));
      }
      data = data.toString(charset);
      if (isMarkdown) {
        data = md.render(data);
      }

      res.status(200).setHeader('Content-Type', fragment.type).send(data);
    } else if (mimeType === 'application/json') {
      data = JSON.parse(data.toString());
      res.status(200).setHeader('Content-Type', fragment.type).json(data);
    } else if (mimeType.startsWith('image/')) {
      res.status(200).setHeader('Content-Type', fragment.type).send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
