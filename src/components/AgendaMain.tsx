import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Layout,
} from 'antd';

import { graphql } from '../services/graphql.service';

import { carregarConsultas, AgendaStore } from '../store/agenda';
import { Store } from '../store/store';
import AgendaDataPicker from './AgendaDataPicker';
import AgendaBoards from './AgendaBoards';

export default function AgendaMain(): JSX.Element {
  const dispatch = useDispatch();
  const { data } = useSelector<Store, AgendaStore>((store) => store.agenda);

  useEffect(() => {
    graphql.consulta.findByDate(
      data ? data.toDate() : new Date(),
    ).then((c) => (dispatch(carregarConsultas(c))));
  }, [data]);

  return (
    <Layout>
      <Row style={{ marginBottom: '10px' }}>
        <AgendaDataPicker />
      </Row>
      <Row>
        <AgendaBoards />
      </Row>
    </Layout>
  );
}
