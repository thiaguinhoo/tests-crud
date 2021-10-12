const cache = require('../utils/cache');

module.exports = async (request, response, next) => {
  const access = '__express__' + request.url || request.originalUrl;
  const cached = cache.get(access);
  if (cached) {
    return response.json(cached);
  }
  response.returnResponse = response.json
  response.json = (data) => {
    cache.set(access, data);
    response.returnResponse(data);
  }
  next();
};

