import React from 'react';
import { useDrag } from 'react-dnd';

import { blue } from '@ant-design/colors';
import ConsultaCard from './ConsultaCard';

type propTypes = {
  consultaId: number;
  boardIndex: number;
  arrayIndex: number;
}

export default function ConsultaCardDraggable(props: propTypes): JSX.Element {
  const { consultaId, boardIndex, arrayIndex } = props;

  const [{ opacity, border }, dragRef] = useDrag({
    item: {
      type: 'consulta',
      consultaId,
      boardIndex,
      arrayIndex,
    },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
      border: monitor.isDragging() ? `1px dashed ${blue[1]}` : `1px solid ${blue[1]}`,
    }),
  });

  return (
    <div ref={dragRef}>
      <ConsultaCard id={consultaId} style={{ opacity, border, cursor: 'all-scroll' }} />
    </div>
  );
}
