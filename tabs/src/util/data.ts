// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  ArticleMetaData,
  ArticleResponse,
  ErrorResponse,
  Lesson,
  LessonDetails,
} from '../shared';

const fetchWithAuth = (
  accessToken: string,
  url: string,
  method: string = 'GET',
  content: any = null
) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', accessToken);
  return fetch(url, {
    headers: myHeaders,
    method: method,
    body: content ? JSON.stringify(content) : null,
  });
};

export const fetchLessons = (accessToken: string): Promise<Array<Lesson>> => {
  return fetchWithAuth(accessToken, '/api/lessons').then((res) => res.json());
};

export const addLesson = (
  accessToken: string,
  link: string
): Promise<Lesson> => {
  return fetchWithAuth(accessToken, '/api/lessons', 'POST', {
    id: '',
    articleUrl: link,
    details: {
      question: '',
    },
  } as Lesson).then((res) => res.json());
};

export const updateLessonPrompt = (
  accessToken: string,
  selectedLesson: Lesson,
  question: string
): Promise<Lesson> => {
  return fetchWithAuth(
    accessToken,
    `/api/lessons/${selectedLesson.id}`,
    'PATCH',
    {
      question: question,
    } as LessonDetails
  ).then((res) => res.json());
};

export const fetchExistingResponse = (
  accessToken: string,
  lessonId: string
): Promise<ErrorResponse | ArticleResponse> => {
  return fetchWithAuth(accessToken, `/api/responses/me/${lessonId}`).then(
    (res) => res.json()
  );
};

export const submitResponse = (
  accessToken: string,
  lesson: Lesson,
  response: ArticleResponse
): Promise<ErrorResponse | ArticleResponse> => {
  return fetchWithAuth(
    accessToken,
    `/api/responses/${lesson.id}`,
    'POST',
    response
  ).then((res) => res.json());
};

export const fetchLesson = (
  accessToken: string,
  lessonId: string
): Promise<ErrorResponse | Lesson> => {
  return fetchWithAuth(accessToken, `/api/lessons/${lessonId}`).then((res) =>
    res.json()
  );
};

export const fetchArticleDetails = (
  accessToken: string,
  lessonId: string
): Promise<ArticleMetaData> => {
  return fetchWithAuth(accessToken, `/api/lessons/${lessonId}/meta`)
    .then((data) => data.json())
    .then((meta) => meta as ArticleMetaData);
};
