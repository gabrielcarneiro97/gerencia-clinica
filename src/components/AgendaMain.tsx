import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'antd';
import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import AgendaBoardDropabble from './AgendaBoardDroppable';
import { consultaDb } from '../services/db.service';
import { Consulta } from '../types';
import { AgendaStore } from '../store/agenda';
import { Store } from '../store/store';
import { carregarConsultas } from '../store/paciente';

export default function AgendaMain(): JSX.Element {
  const dispatch = useDispatch();
  const {
    agendadas,
    salaDeEspera,
    emAtendimento,
    concluidas,
    ausentes,
    // consultas,
  } = useSelector<Store, AgendaStore>((store) => store.agenda);

  console.log(agendadas, salaDeEspera);

  useEffect(() => {
    consultaDb.findByDate(new Date()).then((c) => (dispatch(carregarConsultas(c))));
  }, []);

  return (
    <DndProvider backend={Backend}>
      <Row gutter={8}>
        <Col span={6}>
          <AgendaBoardDropabble title="Agendados" consultasId={agendadas} />
        </Col>
        <Col span={6}>
          <AgendaBoardDropabble title="Sala de Espera" consultasId={salaDeEspera} />
        </Col>
      </Row>
    </DndProvider>
  );
}
