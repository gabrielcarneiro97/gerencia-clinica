/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { connect } from 'react-redux';

import {
  Form,
  Input,
  Col,
  Row,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { Store } from '../store/store';

import { Endereco } from '../types';

import { carregarEndereco, PacienteStore, mudou } from '../store/paciente';

import EstadoSelect from './EstadoSelect';

const { Item } = Form;

function PacienteEnderecoForm(props: FormComponentProps): JSX.Element {
  const { form } = props;
  const { getFieldDecorator } = form;

  return (
    <Form>
      <Row gutter={8}>
        <Col span={6}>
          <Item label="CEP">
            {getFieldDecorator('cep')(
              <Input placeholder="CEP" />,
            )}
          </Item>
        </Col>
        <Col span={18}>
          <Item label="Logradouro">
            {getFieldDecorator('logradouro')(
              <Input placeholder="Logradouro" />,
            )}
          </Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={4}>
          <Item label="Número">
            {getFieldDecorator('numero')(
              <Input placeholder="Número" />,
            )}
          </Item>
        </Col>
        <Col span={4}>
          <Item label="Complemento">
            {getFieldDecorator('complemento')(
              <Input placeholder="Complemento" />,
            )}
          </Item>
        </Col>
        <Col span={16}>
          <Item label="Bairro">
            {getFieldDecorator('bairro')(
              <Input placeholder="Bairro" />,
            )}
          </Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Item label="Cidade">
            {getFieldDecorator('cidade')(
              <Input placeholder="Cidade" />,
            )}
          </Item>
        </Col>
        <Col span={8}>
          <Item label="Estado">
            {getFieldDecorator('estado')(
              <EstadoSelect />,
            )}
          </Item>
        </Col>
        <Col span={8}>
          <Item label="País">
            {getFieldDecorator('pais')(
              <Input placeholder="País" />,
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
    atualizaEndereco(endereco: Endereco): void {
      dispatch(mudou());
      dispatch(carregarEndereco(endereco));
    },
  }),
)(Form.create({
  name: 'pacienteEnderecoForm',
  onFieldsChange(props: any, changedFields: any) {
    const {
      atualizaEndereco,
      paciente,
    }: {
      atualizaEndereco: (endereco: Endereco) => void;
      paciente: PacienteStore;
    } = props;

    const { endereco } = paciente;

    if (!endereco) return;

    const fieldName = Object.keys(changedFields)[0];
    endereco[fieldName] = changedFields[fieldName].value;

    atualizaEndereco(endereco);
  },
  mapPropsToFields(props: any) {
    const { paciente }: { paciente: PacienteStore } = props;

    const { endereco } = paciente;

    const createField = (fieldName: string) => ({
      [fieldName]: Form.createFormField({
        value: endereco && endereco[fieldName],
      }),
    });

    return {
      ...createField('logradouro'),
      ...createField('numero'),
      ...createField('complemento'),
      ...createField('bairro'),
      ...createField('cidade'),
      ...createField('estado'),
      ...createField('pais'),
      ...createField('cep'),
    };
  },
})(PacienteEnderecoForm));
