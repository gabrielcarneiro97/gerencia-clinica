import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col } from 'antd';
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
      <Row gutter={8}>
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
        {/* <Col span={6}>
          <AgendaBoardDropabble title="Não Compareceu" boardIndex={4} />
        </Col> */}
      </Row>
    </DndProvider>
  );
}
