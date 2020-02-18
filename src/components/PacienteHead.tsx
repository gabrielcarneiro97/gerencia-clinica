import React from 'react';
import { Row, Col } from 'antd';
import PacienteNovoButton from './PacienteNovoButton';
import PacienteBuscaForm from './PacientesBuscaInput';


export default function PacienteHead(): JSX.Element {
  return (
    <Row gutter={8} type="flex" justify="space-around" align="middle">
      <Col span={23}>
        <PacienteBuscaForm />
      </Col>
      <Col span={1}>
        <PacienteNovoButton />
      </Col>
    </Row>
  );
}
