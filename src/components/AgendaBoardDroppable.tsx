import React from 'react';
import { useDrop } from 'react-dnd';
import { Card } from 'antd';
import ConsultaCardDraggable from './ConsultaCardDraggable';

type propTypes = {
  title?: string;
  droppableId?: string;
  consultasId: number[];
}

export default function AgendaBoardDropabble(props: propTypes): JSX.Element {
  const {
    title = '',
    droppableId,
    consultasId,
  } = props;

  const [collectedProps, drop] = useDrop({
    accept: 'consulta',
    drop: (item) => console.log(item),
  });

  // console.log(collectedProps);

  return (
    <div ref={drop}>
      <Card
        title={title}
      >
        {consultasId.map((id) => <ConsultaCardDraggable consultaId={id} key={id} />)}
      </Card>
    </div>
  );
}
