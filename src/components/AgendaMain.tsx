import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Row,
  Col,
  DatePicker,
} from 'antd';
import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import moment from 'moment';
import AgendaBoardDropabble from './AgendaBoardDroppable';
import { consultaDb } from '../services/db.service';

import { carregarConsultas } from '../store/agenda';

export default function AgendaMain(): JSX.Element {
  const dispatch = useDispatch();

  const [data, setData] = useState<moment.Moment | null>(moment());

  useEffect(() => {
    consultaDb.findByDate(
      data ? data.toDate() : new Date(),
    ).then((c) => (dispatch(carregarConsultas(c))));
  }, [data]);

  return (
    <DndProvider backend={Backend}>
      <div>
        <Row style={{ marginBottom: 12 }}>
          <DatePicker format="DD/MM/YYYY" value={data} onChange={setData} />
        </Row>
        <Row gutter={4} type="flex" justify="space-between">
          <Col span={4}>
            <AgendaBoardDropabble title="Não Compareceu" boardIndex={4} />
          </Col>
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
        </Row>
      </div>
    </DndProvider>
  );
}
