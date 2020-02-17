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
import { graphql } from '../services/graphql.service';

import { carregarConsultas } from '../store/agenda';
import AgendaBoardDrawerDroppable from './AgendaBoardDrawerDroppable';

export default function AgendaMain(): JSX.Element {
  const dispatch = useDispatch();

  const [data, setData] = useState<moment.Moment | null>(moment());

  useEffect(() => {
    graphql.consulta.findByDate(
      data ? data.toDate() : new Date(),
    ).then((c) => (dispatch(carregarConsultas(c))));
  }, [data]);

  return (
    <DndProvider backend={Backend}>
      <div>
        <Row type="flex" style={{ marginBottom: 12 }}>
          <DatePicker format="DD/MM/YYYY" value={data} onChange={setData} />
        </Row>
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
