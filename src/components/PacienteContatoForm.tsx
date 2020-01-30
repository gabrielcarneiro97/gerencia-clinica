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
import ContatoClass from '../../electron/backend/db/models/Contato';
import { carregarContato, PacienteStore, mudou } from '../store/paciente';

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
  ({ paciente }: Store) => ({ paciente }),
  (dispatch: any) => ({
    atualizaContato(contato: ContatoClass): void {
      dispatch(mudou());
      dispatch(carregarContato(contato));
    },
  }),
)(Form.create({
  name: 'pacienteContatoForm',
  onFieldsChange(props: any, changedFields: any) {
    const {
      atualizaContato,
      paciente,
    }: {
      atualizaContato: (contato: ContatoClass) => void;
      paciente: PacienteStore;
    } = props;

    const { contato } = paciente;

    if (!contato) return;

    const fieldName = Object.keys(changedFields)[0];

    contato.setDataValue(fieldName as any, changedFields[fieldName].value);
    atualizaContato(contato);
  },
  mapPropsToFields(props: any) {
    const { paciente }: { paciente: PacienteStore } = props;

    const { contato } = paciente;

    const createField = (fieldName: string) => ({
      [fieldName]: Form.createFormField({
        value: contato?.getDataValue(fieldName as any),
      }),
    });

    return {
      ...createField('email'),
      ...createField('telefone1'),
      ...createField('telefone2'),
    };
  },
})(PacienteContatosForm));
