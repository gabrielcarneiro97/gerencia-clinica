import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col } from 'antd';
import { red } from '@ant-design/colors';
import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import AgendaBoardDropabble from './AgendaBoardDroppable';
import { consultaDb } from '../services/db.service';

import { carregarConsultas } from '../store/paciente';

export default function AgendaMain(): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => {
    consultaDb.findByDate(new Date()).then((c) => (dispatch(carregarConsultas(c))));
  }, []);

  return (
    <DndProvider backend={Backend}>
      <Row gutter={4} type="flex" justify="space-between">
        <Col span={5}>
          <AgendaBoardDropabble title="Agendados" boardIndex={0} />
        </Col>
        <Col span={5}>
          <AgendaBoardDropabble title="Sala de Espera" boardIndex={1} />
        </Col>
        <Col span={5}>
          <AgendaBoardDropabble title="Em Atendimento" boardIndex={2} />
        </Col>
        <Col span={5}>
          <AgendaBoardDropabble title="Atendimento Concluído" boardIndex={3} />
        </Col>
        <Col span={4}>
          <AgendaBoardDropabble title="Não Compareceu" boardIndex={4} />
        </Col>
      </Row>
    </DndProvider>
  );
}
