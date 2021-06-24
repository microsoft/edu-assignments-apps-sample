import express from 'express';
import { ArticleResponses, ErrorCode } from '../tabs/src/shared';
const responsesRouter = express.Router();

// Post a specific student response
responsesRouter.post('/:lessonId', function (req, res, next) {
  const { lessonId } = req.params;
  const userId = res.locals.userId;

  const responses = res.locals.data as ArticleResponses;

  if (!responses[lessonId]) {
    responses[lessonId] = {};
  }

  responses[lessonId][userId] = req.body;
  res.statusCode = 201;
  res.json(responses[lessonId][userId]);
});

// Get response for logged in user
responsesRouter.get('/me/:lessonId', function (req, res, next) {
  const { lessonId } = req.params;
  const userId = res.locals.userId;

  const responses = res.locals.data as ArticleResponses;

  if (responses[lessonId] && responses[lessonId][userId]) {
    res.json(responses[lessonId][userId]);
  } else {
    res.statusCode = 400;
    res.json({ errorCode: ErrorCode.RESPONSE_DOES_NOT_EXIST });
  }
});

export { responsesRouter };
