import express from 'express';
import {
  ArticleMetaData,
  ArticleResponses,
  ErrorCode,
  ErrorResponse,
  Lesson,
  LessonDetails,
} from '../tabs/src/shared';
import sampleTopics from './sampleLessons.json';
const lessonRouter = express.Router();
import fetch from 'node-fetch';
import { getMetadata } from 'page-metadata-parser';
import * as domino from 'domino';

const data = <Lesson[]>sampleTopics;

// Add a lesson
lessonRouter.post('/', function (req, res, next) {
  const article = req.body as Lesson;
  if (article) {
    article.id = data.length.toString();
    data.push(article);
    console.log(data);
    res.statusCode = 201;
    res.json(article);
  } else {
    res.statusCode = 400;
    res.json({
      errorCode: ErrorCode.BAD_REQUEST,
    } as ErrorResponse);
  }
});

// Get lessons
lessonRouter.get('/', function (req, res, next) {
  res.json(data);
});

// Get a specific lesson
lessonRouter.get('/:id', function (req, res, next) {
  const { id } = req.params;

  const topic = data.find((topic) => topic.id === id);
  if (topic) {
    res.json(topic);
  } else {
    res.statusCode = 400;
    res.json({ errorCode: ErrorCode.LESSON_DOES_NOT_EXIST } as ErrorResponse);
  }
});

// Update prompt for a lesson
lessonRouter.patch('/:id', function (req, res, next) {
  const { id } = req.params;

  const details = req.body as LessonDetails;

  if (!details) {
    res.statusCode = 400;
    res.json({ errorCode: ErrorCode.BAD_REQUEST } as ErrorResponse);
    return;
  }

  let topic = data.find((topic) => topic.id === id);
  if (topic) {
    topic.details = details;
    //data = data.map(d => d.id == id ? topic : d);
    res.json(data.find((topic) => topic.id === id));
  } else {
    res.statusCode = 400;
    res.json({ errorCode: ErrorCode.LESSON_DOES_NOT_EXIST } as ErrorResponse);
  }
});

// Get student responses for a specific lesson
lessonRouter.get('/:id/responses', function (req, res, next) {
  const { id } = req.params;

  const responses = res.locals.data as ArticleResponses;

  if (responses[id]) {
    res.json(responses[id]);
  } else {
    res.statusCode = 400;
    res.json({ errorCode: ErrorCode.NO_RESPONSES } as ErrorResponse);
  }
});

lessonRouter.get('/:id/meta', function (req, res, next) {
  const { id } = req.params;

  const lesson = data.find((d) => d.id === id);

  if (lesson) {
    const url = lesson.articleUrl;

    fetch(url)
      .then((response) => response.text())
      .then((html) => domino.createWindow(html).document)
      .then((doc) => getMetadata(doc, url))
      .then((metadata) =>
        res.json({
          title: metadata.title,
          description: metadata.description,
          imageUrl: metadata.image,
          datePublished: new Date().toDateString(),
        } as ArticleMetaData)
      );
  } else {
    res.statusCode = 400;
    res.json({ errorCode: ErrorCode.LESSON_DOES_NOT_EXIST } as ErrorResponse);
  }
});

export { lessonRouter };
