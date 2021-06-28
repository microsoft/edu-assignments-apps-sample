// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import jwt from 'jsonwebtoken';

import { lessonRouter } from './lessons';
import { responsesRouter } from './responses';
import { ArticleResponses } from '../tabs/src/shared';

const responses: ArticleResponses = {};

const app = express();

app.use(cors());

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Parse access token passed in through SSO
// Note: Here we're using the token directly for the purposes of this sample.
app.use(function (req, res, next) {
  const token = req.header('Authorization');

  if (!token) return res.status(401).send('Access denied. No token provided.');

  const decodedJwt = jwt.decode(token, { complete: true });

  if (!decodedJwt || !decodedJwt.payload || !decodedJwt.payload.oid)
    return res.status(401).send('Access denied. Invalid token.');

  res.locals.userId = decodedJwt.payload.oid;

  next();
});

// In-memory data store
app.use(function(req, res, next) {
  res.locals.data = responses;
  next();
});

// Routes
app.use('/api/lessons', lessonRouter);
app.use('/api/responses', responsesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
