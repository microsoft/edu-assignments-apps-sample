import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Flex,
  Form,
  FormButton,
  FormTextArea,
  Loader,
  Text,
  TextAreaProps,
} from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';
import { LessonPreview } from '../components/LessonPreview';
import { ArticleResponse, ErrorCode, ErrorResponse, Lesson } from '../shared';
import {
  fetchArticleDetails,
  fetchExistingResponse,
  fetchLesson,
  submitResponse,
} from '../util';

export default function Tab() {
  const queryParams = new URLSearchParams(useLocation().search);

  const lessonId = queryParams.get('lessonId');
  const [lesson, setLesson] = useState(null as Lesson | null);
  const [response, setResponse] = useState(
    undefined as ArticleResponse | undefined
  );
  const [isSavingResponse, setIsSavingResponse] = useState(false);
  const [accessToken, setAccessToken] = useState(null as string | null);

  /*
   * Event handlers
   */
  const onSubmit = (response: ArticleResponse) => {
    if (lesson && accessToken) {
      setIsSavingResponse(true);
      submitResponse(accessToken, lesson, response)
        .then((data) => {
          if (!(data as ErrorResponse).errorCode) {
            setResponse(data as ArticleResponse);
          } else {
            console.error((data as ErrorResponse).errorCode);
          }
        })
        .finally(() => setIsSavingResponse(false));
    }
  };

  const onSubmitForm = () => {
    if (response) {
      onSubmit(response);
    }
  };

  const onResponseChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: TextAreaProps | undefined
  ) => {
    setResponse({ responseText: data?.value ?? '' });
  };

  /*
   * useEffect hooks
   */
  useEffect(() => {
    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize();

    microsoftTeams.authentication.getAuthToken({
      successCallback: function (result: any) {
        setAccessToken(result);
        microsoftTeams.appInitialization.notifyAppLoaded();

        if (lessonId) {
          fetchLesson(result, lessonId).then((data) => {
            if (
              (data as ErrorResponse).errorCode !==
              ErrorCode.RESPONSE_DOES_NOT_EXIST
            ) {
              setLesson(data as Lesson);
            }
          });
          fetchExistingResponse(result, lessonId).then((data) => {
            if (
              (data as ErrorResponse).errorCode !==
              ErrorCode.RESPONSE_DOES_NOT_EXIST
            ) {
              setResponse(data as ArticleResponse);
            }
          });
        }
      },
      failureCallback: function (error: any) {
        microsoftTeams.appInitialization.notifyFailure({
          reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
        });
      },
    });
  }, []);

  return (
    <>
      {!lesson && <Loader />}
      {lesson && accessToken && (
        <Flex column={true} style={{ padding: '20px' }} gap="gap.small">
          <Flex column={true}>
            <Text size="small" color="grey" weight="semibold">
              Prompt
            </Text>
            <Text>
              {lesson?.details.question
                ? lesson?.details.question
                : 'Read the article and respond with a short summary.'}
            </Text>
          </Flex>
          {
            <LessonPreview
              lesson={lesson}
              isExpandedView={true}
              onFetchArticleDetails={fetchArticleDetails.bind(
                null,
                accessToken,
                lesson.id
              )}
            />
          }
          <Form onSubmit={onSubmitForm}>
            <FormTextArea
              fluid={true}
              resize="vertical"
              label="Response"
              placeholder={
                lesson?.details.question
                  ? 'Type your response to the prompt'
                  : 'Type a short summary'
              }
              value={response?.responseText}
              required={true}
              onChange={onResponseChange}
            />
            <FormButton
              disabled={isSavingResponse || !response?.responseText}
              content="Save"
              primary={true}
              styles={{ alignSelf: 'flex-end' }}
              loading={isSavingResponse}
            />
          </Form>
        </Flex>
      )}
    </>
  );
}
