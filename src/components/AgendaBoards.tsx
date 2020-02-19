import React from 'react';
import {
  Row,
  Col,
} from 'antd';
import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import AgendaBoardDropabble from './AgendaBoardDroppable';

import AgendaBoardDrawerDroppable from './AgendaBoardDrawerDroppable';

export default function AgendaBoards(): JSX.Element {
  return (
    <DndProvider backend={Backend}>
      <div>
        <div className="agenda-boards" style={{ overflow: 'hidden', position: 'relative' }}>
          <Row type="flex">
            <Col span={2} style={{ minHeight: '100%' }}>
              <AgendaBoardDrawerDroppable title="Não Compareceu" boardIndex={4} />
            </Col>
            <Col span={22}>
              <Row gutter={4} type="flex" justify="space-between">
                <Col span={6}>
                  <AgendaBoardDropabble title="Agendados" boardIndex={0} />
                </Col>
                <Col span={6}>
                  <AgendaBoardDropabble title="Sala de Espera" boardIndex={1} />
                </Col>
                <Col span={6}>
                  <AgendaBoardDropabble title="Em Atendimento" boardIndex={2} />
                </Col>
                <Col span={6}>
                  <AgendaBoardDropabble title="Atendimento Concluído" boardIndex={3} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </DndProvider>
  );
}
