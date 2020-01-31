import React from 'react';
import { useDrag } from 'react-dnd';

import ConsultaCard from './ConsultaCard';

type propTypes = {
  consultaId: number;
}

export default function ConsultaCardDraggable(props: propTypes): JSX.Element {
  const { consultaId } = props;
  const [{ opacity }, dragRef] = useDrag({
    item: { type: 'consulta', consultaId },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  return (
    <div ref={dragRef}>
      <ConsultaCard id={consultaId} style={{ opacity }} />
    </div>
  );
}
