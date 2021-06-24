import { ErrorCode } from "./constants";

export interface ArticleMetaData {
  title: string;
  imageUrl: string;
  description: string;
  datePublished: string;
}

export interface LessonDetails {
  question: string;
}

export interface Lesson {
  id: string;
  articleUrl: string;
  details: LessonDetails;
}

export interface ArticleResponse {
  responseText: string;
}

export interface ArticleResponses {
  [articleId: string]: { [userId: string]: ArticleResponse };
}

export interface ErrorResponse {
  errorCode: ErrorCode
}
