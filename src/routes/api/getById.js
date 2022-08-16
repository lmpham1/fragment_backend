// src/routes/api/getById.js
const sharp = require('sharp');

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const md = require('markdown-it')();
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const url = req.params.id;
  let id = url;
  if (url.match(/^[A-Za-z0-9_-]+\.[A-Za-z]+$/)) {
    id = url.substr(0, url.search(/\.[A-Za-z]+$/));
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
      if (url.endsWith('.md')) {
        data = md.render(data);
      }
      res.status(200).setHeader('Content-Type', fragment.type).send(data);
    } else if (mimeType === 'application/json') {
      data = JSON.parse(data.toString());
      res.status(200).setHeader('Content-Type', fragment.type).json(data);
    } else if (mimeType.startsWith('image/')) {
      data = sharp(data);
      let viewType = fragment.type;
      if (url.endsWith('.jpeg') || id.endsWith('.jpg')) {
        data = await data.jpeg();
        viewType = 'image/jpeg';
      } else if (url.endsWith('.png')) {
        data = await data.png();
        viewType = 'image/png';
      } else if (url.endsWith('.webp')) {
        data = await data.webp();
        viewType = 'image/webp';
      } else if (url.endsWith('.gif')) {
        data = await data.gif();
        viewType = 'image/gif';
      }
      data = await data.toBuffer();
      res.status(200).setHeader('Content-Type', viewType).send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
