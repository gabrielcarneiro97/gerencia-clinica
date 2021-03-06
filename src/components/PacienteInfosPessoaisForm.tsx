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
import { carregarPaciente, PacienteStore, mudou } from '../store/paciente';

import { Paciente } from '../types';
import PacienteGrupoSelect from './PacienteGrupoSelect';

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
        <Col span={8}>
          <Item label="Tipo de Transplante">
            {getFieldDecorator('grupo1Id', {
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <PacienteGrupoSelect tipo={1} />,
            )}
          </Item>
        </Col>
        <Col span={4}>
          <Item label="Pré/Pós">
            {getFieldDecorator('grupo2Id', {
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <PacienteGrupoSelect tipo={2} />,
            )}
          </Item>
        </Col>
        <Col span={12}>
          <Item label="CPF">
            {getFieldDecorator('cpf')(
              <Input placeholder="CPF" />,
            )}
          </Item>
        </Col>
        <Col span={6}>
          <Item label="Nascimento">
            {getFieldDecorator('nascimento')(
              <DatePicker format="DD/MM/YYYY" />,
            )}
          </Item>
        </Col>
        <Col span={6}>
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
  ({ paciente }: Store) => ({ pacienteStore: paciente }),
  (dispatch: any) => ({
    atualizaPaciente(paciente: Paciente): void {
      dispatch(mudou());
      dispatch(carregarPaciente(paciente));
    },
  }),
)(Form.create({
  name: 'pacienteInfosPessoaisForm',
  onFieldsChange(props: any, changedFields: any) {
    const {
      atualizaPaciente,
      pacienteStore,
    }: {
      atualizaPaciente: (paciente: Paciente) => void;
      pacienteStore: PacienteStore;
    } = props;

    const { paciente } = pacienteStore;

    if (!paciente) return;

    const newPaciente = { ...paciente };

    const fieldName = Object.keys(changedFields)[0];
    if (fieldName === 'nascimento') {
      newPaciente[fieldName] = changedFields[fieldName].value
        ? (changedFields[fieldName].value as Moment).toDate()
        : null;
    } else {
      newPaciente[fieldName] = changedFields[fieldName].value;
    }
    atualizaPaciente(newPaciente);
  },
  mapPropsToFields(props: any) {
    const { pacienteStore }: { pacienteStore: PacienteStore } = props;

    const { paciente } = pacienteStore;

    const createField = (fieldName: string) => {
      const field = paciente && paciente[fieldName];

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
      ...createField('grupo1Id'),
      ...createField('grupo2Id'),
    };
  },
})(PacienteInfosPessoaisForm));
