import React, { useState } from 'react';
import { Row, Col } from 'antd';
import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import ConsultaCard from './ConsultaCard';
import ConsultaCardDraggable from './ConsultaCardDraggable';
import AgendaBoardDropabble from './AgendaBoardDroppable';

export default function AgendaMain(): JSX.Element {
  return (
    <DndProvider backend={Backend}>
      <Row gutter={8}>
        <Col span={6}>
          <AgendaBoardDropabble title="Agendados" consultasId={[11]} />
        </Col>
        <Col span={6}>
          <AgendaBoardDropabble title="Sala de Espera" consultasId={[]} />
        </Col>
      </Row>
    </DndProvider>
  );
}
