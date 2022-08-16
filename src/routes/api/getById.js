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
    switch (fragment.mimeType) {
      case 'text/plain': {
        const type = fragment.type;
        let charset = undefined;
        if (type.includes('charset=')) {
          charset = fragment.type.substr(fragment.type.search(/(?<=charset=).*$/g));
        }
        data = data.toString(charset);
        if (isMarkdown) {
          data = md.render(data);
        }

        res.status(200).send(data);
        break;
      }
      case 'application/json':
        data = JSON.parse(data.toString());
        res.status(200).json(data);
        break;
      case 'image/png':
        res.writeHead(200, {
          'Content-Type': 'image/png',
        });
        res.send(data);
        break;
      case 'image/jpeg':
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
        });
        res.send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
