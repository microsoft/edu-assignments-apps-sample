import React from 'react';
import { ArticleMetaData, Lesson } from '../shared';
import { LessonPreview } from './LessonPreview';

import './LessonTile.css';

interface LessonTileProps {
  lesson: Lesson;
  isSelected: boolean;

  onFetchArticleDetails: () => Promise<ArticleMetaData>;

  onSelect: () => void;
}

export function LessonTile(props: LessonTileProps) {
  const { lesson, isSelected, onFetchArticleDetails, onSelect } = props;

  const onTileSelect = (e: React.MouseEvent<HTMLInputElement>) => {
    onSelect();
  };

  return (
    <label className="lesson-tile" id={lesson.id}>
      <input
        type="radio"
        name="lesson-choice"
        value={lesson.id}
        onClick={onTileSelect}
        checked={isSelected}
        autoFocus={true}
      />
      <LessonPreview lesson={lesson} onFetchArticleDetails={onFetchArticleDetails} />
    </label>
  );
}
