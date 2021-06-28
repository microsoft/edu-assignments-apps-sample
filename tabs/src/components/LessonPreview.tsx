// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useState } from 'react';
import { ArticleMetaData, Lesson } from '../shared';
import {
  Button,
  Card,
  cardsContainerBehavior,
  Divider,
  Skeleton,
  Text,
} from '@fluentui/react-northstar';

import './LessonPreview.css';

interface LessonPreviewProps {
  lesson: Lesson;

  isExpandedView?: boolean;

  onFetchArticleDetails: () => Promise<ArticleMetaData>;
}

export function LessonPreview(props: LessonPreviewProps) {
  const { lesson, isExpandedView, onFetchArticleDetails } = props;

  const [details, setDetails] = useState(null as ArticleMetaData | null);

  const onClickArticle = (event: React.SyntheticEvent<HTMLElement, Event>) => {
    window.open(lesson.articleUrl, '_blank');
  };

  useEffect(() => {
    onFetchArticleDetails().then((meta) => setDetails(meta));
  }, [lesson]);

  return (
    <>
      {isExpandedView && <Divider />}
      <Card
        className="lesson-preview"
        horizontal={true}
        fluid={true}
        accessibility={cardsContainerBehavior}
        style={
          isExpandedView
            ? {}
            : {
                maxHeight: '146px',
              }
        }
      >
        <Card.Preview horizontal>
          <div
            className="image"
            style={
              isExpandedView
                ? {
                    backgroundImage: `url(${details?.imageUrl})`,
                    height: '227px',
                    width: '413px',
                  }
                : {
                    backgroundImage: `url(${details?.imageUrl})`,
                    height: '100%',
                    width: '172px',
                  }
            }
          >
            {!details && (
              <Skeleton>
                <Skeleton.Shape />
              </Skeleton>
            )}
          </div>
        </Card.Preview>
        <Card.Column>
          <Card.Header>
            {false && (
              <Text size="smaller" color="grey" timestamp={true}>
                {details?.datePublished}
                {!details && (
                  <Skeleton>
                    <Skeleton.Line />
                  </Skeleton>
                )}
              </Text>
            )}
            <Text size="medium" weight="semibold" truncated={true}>
              {details?.title}
              {!details && (
                <Skeleton>
                  <Skeleton.Line />
                </Skeleton>
              )}
            </Text>
          </Card.Header>
          <Card.Body>
            <Text
              className="description"
              size="medium"
              weight="regular"
              truncated={true}
            >
              {details?.description}
              {!details && (
                <Skeleton>
                  <Skeleton.Line />
                </Skeleton>
              )}
            </Text>
          </Card.Body>
          {isExpandedView && (
            <Card.Footer>
              <Button content="View Article" onClick={onClickArticle} />
            </Card.Footer>
          )}
        </Card.Column>
      </Card>
      {isExpandedView && <Divider />}
    </>
  );
}
