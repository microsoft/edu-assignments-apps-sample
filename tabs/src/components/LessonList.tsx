// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Divider, Loader } from '@fluentui/react-northstar';
import { ArticleMetaData, Lesson } from '../shared';
import { LessonTile } from './LessonTile';

interface LessonListProps {
  lessons?: Lesson[];
  selectedLesson?: Lesson;

  onFetchArticleDetails: (lessonId: string) => Promise<ArticleMetaData>;
  onSelectLesson: (lesson: Lesson) => void;
}

function LessonList(props: LessonListProps) {
  const { lessons, selectedLesson, onFetchArticleDetails, onSelectLesson } =
    props;

  return (
    <section className="selection-list">
      {!lessons && <Loader />}
      {lessons &&
        lessons.map((lesson, index) => (
          <>
            <LessonTile
              key={lesson.id}
              lesson={lesson}
              onFetchArticleDetails={onFetchArticleDetails.bind(
                null,
                lesson.id
              )}
              isSelected={selectedLesson?.id === lesson.id}
              onSelect={onSelectLesson.bind(null, lesson)}
            />
            {index < lessons.length - 1 && <Divider />}
          </>
        ))}
    </section>
  );
}

export default LessonList;
