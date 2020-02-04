import React from 'react';
import { useDrag } from 'react-dnd';

import ConsultaCard from './ConsultaCard';

type propTypes = {
  consultaId: number;
  boardIndex: number;
  arrayIndex: number;
}

export default function ConsultaCardDraggable(props: propTypes): JSX.Element {
  const { consultaId, boardIndex, arrayIndex } = props;

  const [{ opacity }, dragRef] = useDrag({
    item: {
      type: 'consulta',
      consultaId,
      boardIndex,
      arrayIndex,
    },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  return (
    <div ref={dragRef}>
      <ConsultaCard id={consultaId} style={{ opacity, cursor: 'all-scroll' }} />
    </div>
  );
}
