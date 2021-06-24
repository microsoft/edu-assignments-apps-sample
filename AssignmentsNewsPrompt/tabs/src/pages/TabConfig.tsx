import React, { useEffect, useState } from 'react';
import {
  Text,
  Input,
  Flex,
  Divider,
  LinkIcon,
} from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';
import LessonList from '../components/LessonList';
import LessonPrompt from '../components/LessonPrompt';
import { Lesson } from '../shared';
import {
  fetchArticleDetails,
  addLesson,
  fetchLessons,
  updateLessonPrompt,
} from '../util';

import './TabConfig.css';

function TabConfig() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchboxDisabled, setSearchboxDisabled] = useState(false);
  const [lessons, setLessons] = useState([] as Array<Lesson>);
  const [selectedLesson, setSelectedLesson] = useState(
    undefined as Lesson | undefined
  );
  const [accessToken, setAccessToken] = useState(null as string | null);

  const setExistingLesson = (data: Lesson[]) => {
    microsoftTeams.settings.getSettings((existingSettings) => {
      const existingLesson = data.find(
        (lesson) => lesson.id === existingSettings.entityId
      );
      if (existingLesson) {
        setSelectedLesson(existingLesson);
        document
          .getElementById(existingLesson.id)
          ?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  /*
   * Event handlers
   */
  const onLinkChanged = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: { value: string } | undefined
  ) => {
    if (!data) {
      return;
    }

    setSearchTerm(data.value);
  };

  const onSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const onKeyDownInput = (
    event: React.SyntheticEvent<HTMLInputElement, Event>
  ) => {
    const keyEvent = event.nativeEvent as KeyboardEvent;
    if (keyEvent.code === 'Enter') {
      if (accessToken) {
        setSearchboxDisabled(true);
        addLesson(accessToken, searchTerm).then((lesson: Lesson) => {
          setLessons([...lessons, lesson]);
          setSelectedLesson(lesson);
          setSearchTerm('');
          setSearchboxDisabled(false);
        });
      }
    }
  };

  useEffect(() => {
    /**
     * After verifying that the settings for your tab are correctly
     * filled in by the user you need to set the state of the dialog
     * to be valid.  This will enable the save button in the configuration
     * dialog.
     */
    if (selectedLesson) {
      microsoftTeams.settings.setValidityState(true);
    }
  }, [selectedLesson]);

  const onPromptChanged = (prompt: string) => {
    if (
      prompt !== selectedLesson?.details.question &&
      accessToken &&
      selectedLesson
    ) {
      updateLessonPrompt(accessToken, selectedLesson, prompt ?? '').then(
        (data: Lesson) => {
          setLessons(
            lessons.map((lesson) => {
              if (lesson.id === selectedLesson.id) {
                return data;
              } else {
                return lesson;
              }
            })
          );
        }
      );
    }
  };

  /**
   * Single Sign-on
   */
  const authTokenRequest = {
    successCallback: function (result: any) {
      setAccessToken(result);
      microsoftTeams.appInitialization.notifyAppLoaded();

      fetchLessons(result).then((data: Lesson[]) => {
        setLessons(data);
        microsoftTeams.appInitialization.notifySuccess();
        setExistingLesson(data);
      });
    },
    failureCallback: function (error: any) {
      microsoftTeams.appInitialization.notifyFailure({
        reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
      });
    },
  };

  useEffect(() => {
    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize();

    microsoftTeams.authentication.getAuthToken(authTokenRequest);
  }, []);

  /**
   * When the user clicks "Save", save the url for your configured tab.
   * This allows for the addition of query string parameters based on
   * the settings selected by the user.
   */
  microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {
    if (selectedLesson) {
      const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
      microsoftTeams.settings.setSettings({
        suggestedDisplayName: '',
        entityId: selectedLesson.id,
        contentUrl: baseUrl + `/index.html#/tab?lessonId=${selectedLesson.id}`,
        websiteUrl: baseUrl + `/index.html#/tab?lessonId=${selectedLesson.id}`,
      });

      saveEvent.notifySuccess();
    } else {
      saveEvent.notifyFailure();
    }
  });

  return (
    <Flex gap="gap.medium" column={true}>
      <Text color="grey">
        Add an article to the assignment you are creating.
      </Text>
      <Flex gap="gap.small">
        <Input
          fluid={true}
          clearable={true}
          disabled={searchboxDisabled}
          placeholder="Enter url..."
          icon={<LinkIcon />}
          value={searchTerm}
          onChange={onLinkChanged}
          onKeyDown={onKeyDownInput}
        />
      </Flex>
      {accessToken && (
        <LessonList
          lessons={lessons}
          selectedLesson={selectedLesson}
          onFetchArticleDetails={fetchArticleDetails.bind(null, accessToken)}
          onSelectLesson={onSelectLesson}
        />
      )}
      <Divider />
      <LessonPrompt
        prompt={selectedLesson?.details.question}
        canAddPrompt={!!selectedLesson}
        onPromptChanged={onPromptChanged}
      />
    </Flex>
  );
}

export default TabConfig;
