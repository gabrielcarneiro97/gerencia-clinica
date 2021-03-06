/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { connect } from 'react-redux';

import {
  Form,
  Input,
  Row,
  Col,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { Store } from '../store/store';
import { carregarContato, PacienteStore, mudou } from '../store/paciente';

import { Contato } from '../types';

const { Item } = Form;

function PacienteContatosForm(props: FormComponentProps): JSX.Element {
  const { form } = props;
  const { getFieldDecorator } = form;


  return (
    <Form>
      <Row gutter={8}>
        <Col span={12}>
          <Item label="Email">
            {getFieldDecorator('email')(
              <Input placeholder="Email" />,
            )}
          </Item>
        </Col>
        <Col span={6}>
          <Item label="Telefone 1">
            {getFieldDecorator('telefone1')(
              <Input placeholder="Telefone 1" />,
            )}
          </Item>
        </Col>
        <Col span={6}>
          <Item label="Telefone 2">
            {getFieldDecorator('telefone2')(
              <Input placeholder="Telefone 2" />,
            )}
          </Item>
        </Col>
      </Row>
    </Form>
  );
}

export default connect(
  ({ paciente }: Store) => ({ pacienteStore: paciente }),
  (dispatch: any) => ({
    atualizaContato(contato: Contato): void {
      dispatch(mudou());
      dispatch(carregarContato(contato));
    },
  }),
)(Form.create({
  name: 'pacienteContatoForm',
  onFieldsChange(props: any, changedFields: any) {
    const {
      atualizaContato,
      pacienteStore,
    }: {
      atualizaContato: (contato: Contato) => void;
      pacienteStore: PacienteStore;
    } = props;

    const { contato } = pacienteStore.paciente;

    if (!contato) return;

    const newContato = { ...contato };

    const fieldName = Object.keys(changedFields)[0];

    newContato[fieldName] = changedFields[fieldName].value;

    atualizaContato(newContato);
  },
  mapPropsToFields(props: any) {
    const { pacienteStore }: { pacienteStore: PacienteStore } = props;

    const { contato } = pacienteStore.paciente;

    const createField = (fieldName: string) => ({
      [fieldName]: Form.createFormField({
        value: contato && contato[fieldName],
      }),
    });

    return {
      ...createField('email'),
      ...createField('telefone1'),
      ...createField('telefone2'),
    };
  },
})(PacienteContatosForm));
