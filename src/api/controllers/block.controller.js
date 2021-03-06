const httpStatus = require("http-status");
const { omit } = require("lodash");
const aqp = require("api-query-params");
const Block = require("../models/block.model");
const { handler: errorHandler } = require("../middlewares/error");
const { service_name, eosd, faucet } = require('../../config/vars');

/**
 * Load EOS Block and append to req.
 * @public
 */
exports.load = async (req, res, next, block_ident) => {
  try {
    const block = await Block.get(block_ident);
    req.locals = { block };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get EOS Block
 * @public
 */
exports.get = (req, res) => res.json(req.locals.block);

/**
 * Get EOS Head Block from Blockchain
 * @public
 */
exports.head = async (req, res, next) => {
  try {
    const resp = await
    fetch(`${eosd.uri}/v1/chain/get_info`, {
      method: 'GET'
    });
    let json;
    if (resp.headers.get('content-type').indexOf('json') > -1) {
      json = await
      resp.json();
    } else {
      const text = await
      resp.text();
      json = JSON.parse(text);
    }
    res.status(resp.status);
    res.json(json);
  } catch (error) {
    next(error);
  }
};


/**
 * Get Block list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = aqp(req.query);
    const blocks = await Block.list(query);
    res.json(blocks);
  } catch (error) {
    next(error);
  }
};
