/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { connect } from 'react-redux';

import moment, { Moment } from 'moment';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Row,
  Col,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { Store } from '../store/store';
import PacienteClass from '../db/models/Paciente';
import { carregarInfosPessoais, PacienteStore, mudou } from '../store/paciente';

const { Item } = Form;
const { Option } = Select;

function PacienteInfosPessoaisForm(props: FormComponentProps): JSX.Element {
  const { form } = props;
  const { getFieldDecorator } = form;

  return (
    <Form>
      <Row gutter={8}>
        <Col span={12}>
          <Item label="Nome">
            {getFieldDecorator('nome', {
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Input placeholder="Nome" />,
            )}
          </Item>
        </Col>
        <Col span={4}>
          <Item label="CPF">
            {getFieldDecorator('cpf')(
              <Input placeholder="CPF" />,
            )}
          </Item>
        </Col>
        <Col span={4}>
          <Item label="Nascimento">
            {getFieldDecorator('nascimento')(
              <DatePicker format="DD/MM/YYYY" />,
            )}
          </Item>
        </Col>
        <Col span={4}>
          <Item label="Sexo">
            {getFieldDecorator('sexo')(
              <Select>
                <Option value="F">Feminino</Option>
                <Option value="M">Masculino</Option>
              </Select>,
            )}
          </Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <Item label="Nome da Mãe">
            {getFieldDecorator('filiacao1')(
              <Input placeholder="Nome da Mãe" />,
            )}
          </Item>
        </Col>
        <Col span={12}>
          <Item label="Nome do Pai">
            {getFieldDecorator('filiacao2')(
              <Input placeholder="Nome do Pai" />,
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
    atualizaInfosPessoais(paciente: PacienteClass): void {
      dispatch(mudou());
      dispatch(carregarInfosPessoais(paciente));
    },
  }),
)(Form.create({
  name: 'pacienteInfosPessoaisForm',
  onFieldsChange(props: any, changedFields: any) {
    const {
      atualizaInfosPessoais,
      paciente,
    }: {
      atualizaInfosPessoais: (paciente: PacienteClass) => void;
      paciente: PacienteStore;
    } = props;

    const { infosPessoais } = paciente;

    if (!infosPessoais) return;

    const fieldName = Object.keys(changedFields)[0];
    if (fieldName === 'nascimento') {
      infosPessoais.setDataValue(
        fieldName as any,
        changedFields[fieldName].value
          ? (changedFields[fieldName].value as Moment).toDate()
          : null,
      );
    } else {
      infosPessoais.setDataValue(fieldName as any, changedFields[fieldName].value);
    }
    atualizaInfosPessoais(infosPessoais);
  },
  mapPropsToFields(props: any) {
    const { paciente }: { paciente: PacienteStore } = props;

    const { infosPessoais } = paciente;

    const createField = (fieldName: string) => {
      const field = infosPessoais?.getDataValue(fieldName as any);

      return {
        [fieldName]: Form.createFormField({
          value: fieldName !== 'nascimento' ? field : field && moment(field),
        }),
      };
    };

    return {
      ...createField('nome'),
      ...createField('cpf'),
      ...createField('nascimento'),
      ...createField('sexo'),
      ...createField('filiacao1'),
      ...createField('filiacao2'),
    };
  },
})(PacienteInfosPessoaisForm));
