import React, { useEffect, useRef, useState } from 'react';
import { AddIcon, Button, Flex, Input, Text } from '@fluentui/react-northstar';

interface LessonPromptProps {
  prompt?: string;
  canAddPrompt: boolean;

  onPromptChanged: (newPrompt: string) => void;
}

function LessonPrompt(props: LessonPromptProps) {
  const [prompt, setPrompt] = useState(props.prompt ?? '');
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const { canAddPrompt } = props;

  let pendingSaveTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (pendingSaveTimeout.current) {
      clearTimeout(pendingSaveTimeout.current);
    }
    pendingSaveTimeout.current = setTimeout(
      () => props.onPromptChanged(prompt),
      500
    );
  }, [prompt]);

  useEffect(() => {
    setPrompt(props.prompt ?? '');
  }, [props.prompt]);

  const onPromptChanged = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: { value: string } | undefined
  ) => {
    if (!data) {
      return;
    }

    setPrompt(data.value);
  };

  return (
    <>
      {!prompt && !isAddingPrompt && (
        <Flex gap="gap.large" vAlign="center">
          <Button
            disabled={!canAddPrompt}
            icon={<AddIcon />}
            text={true}
            content="Add response question"
            onClick={() => setIsAddingPrompt(true)}
          />
        </Flex>
      )}
      {(isAddingPrompt || prompt) && (
        <Flex gap="gap.small" column={true}>
          <Text size="small" color="grey" weight="semibold">
            Prompt
          </Text>
          <Input
            fluid={true}
            clearable={true}
            placeholder="Type a question prompt..."
            value={prompt ?? 'Type a question prompt...'}
            onChange={onPromptChanged}
          />
        </Flex>
      )}
    </>
  );
}

export default LessonPrompt;
