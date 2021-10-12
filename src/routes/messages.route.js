const { Router } = require('express');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { body, validationResult } = require('express-validator');

const messages = require('../models/messages.model');
const cacheMiddleware = require('../middlewares/cache.middleware');

const router = Router();

router.route('/')
  .get(cacheMiddleware, async (request, response) => {
    const allMessages = await messages.find();
    response
      .status(StatusCodes.OK)
      .json(allMessages);
  })
  .post(body('content').isLength({ min: 3 }), async (request, response) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      const { content } = request.body;
      const message = await messages.create({ content });
      return response
        .status(StatusCodes.CREATED)
        .json(message);
    }
    response
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  });

router.route('/:id')
  .get(cacheMiddleware, async (request, response) => {
    try {
      const message = await messages.findById(request.params.id);
      response
        .status(StatusCodes.OK)
        .json(message);
    } catch (err) {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: getReasonPhrase(StatusCodes.NOT_FOUND) });
    }
  })
  .put(body('content').isLength({ min: 3 }), async (request, response) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      const { content } = request.body;
      const message = await messages.findByIdAndUpdate(
        request.params.id,
        { content },
        { new: true }
      );
      return response
        .status(StatusCodes.OK)
        .json(message);
    }
    response
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  })
  .delete(async (request, response) => {
    try {
      await messages.findByIdAndRemove(request.params.id);
      response.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: getReasonPhrase(StatusCodes.NOT_FOUND) });
    }
  })

module.exports = router;

