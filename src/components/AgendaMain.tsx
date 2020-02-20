import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Layout,
} from 'antd';

import { hooks } from '../services/graphql.service';

import { carregarConsultas, AgendaStore } from '../store/agenda';
import { Store } from '../store/store';
import AgendaDataPicker from './AgendaDataPicker';
import AgendaBoards from './AgendaBoards';

function useGetConsultas() {
  const dispatch = useDispatch();

  const [getConsultas, {
    data,
    loading,
  }] = hooks.useConsultasByDateLazy();

  useEffect(() => {
    if (data && !loading) {
      const { consultas } = data;
      dispatch(carregarConsultas(consultas));
    }
  }, [data, loading]);

  return getConsultas;
}

function useComponent() {
  const { data: dataHora } = useSelector<Store, AgendaStore>((store) => store.agenda);
  const getConsultas = useGetConsultas();

  useEffect(() => {
    getConsultas({
      variables: {
        data: dataHora ? dataHora.toDate() : new Date(),
      },
    });
  }, [dataHora]);
}

export default function AgendaMain(): JSX.Element {
  useComponent();

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
