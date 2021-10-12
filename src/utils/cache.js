const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3 });

module.exports = cache;

