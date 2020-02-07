import React from 'react';

import AgendaDropabble from './AgendaDroppable';
import AgendaBoard from './AgendaBoard';

type propTypes = {
  title?: string;
  boardIndex: number;
}

export default function AgendaBoardDropabble(props: propTypes): JSX.Element {
  const {
    title = '',
    boardIndex,
  } = props;

  return (
    <AgendaDropabble boardIndex={boardIndex}>
      <AgendaBoard boardIndex={boardIndex} title={title} />
    </AgendaDropabble>
  );
}
