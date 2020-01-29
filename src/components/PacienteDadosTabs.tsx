import React from 'react';
import {
  Tabs,
  Row,
  Col,
  Button,
} from 'antd';

import PacienteInfosPessoaisForm from './PacienteInfosPessoaisForm';
import PacienteEnderecoForm from './PacienteEnderecoForm';
import PacienteContatoForm from './PacienteContatoForm';
import PacienteSaveButton from './PacienteSaveButton';

const { TabPane } = Tabs;

export default function PacienteDadosTabs(): JSX.Element {
  return (
    <>
      <Row>
        <Col>
          <Tabs
            defaultActiveKey="1"
            style={{
              marginTop: -16,
            }}
          >
            <TabPane
              key="1"
              tab="Informações Pessoais"
            >
              <PacienteInfosPessoaisForm />
            </TabPane>
            <TabPane
              key="2"
              tab="Endereço"
            >
              <PacienteEnderecoForm />
            </TabPane>
            <TabPane
              key="3"
              tab="Contato"
            >
              <PacienteContatoForm />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      <Row type="flex" justify="end" gutter={8}>
        <Col>
          <PacienteSaveButton />
        </Col>
      </Row>
    </>
  );
}
