/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { connect } from 'react-redux';
import moment, { Moment } from 'moment';

import {
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Select,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { Store } from '../store/store';

import { Consulta } from '../types';

import { ConsultaStore, carregarConsulta, mudou } from '../store/consulta';

const { Option } = Select;
const { TextArea } = Input;
const { Item } = Form;

function ConsultaModalForm(props: FormComponentProps): JSX.Element {
  const { form } = props;
  const { getFieldDecorator } = form;


  return (
    <Form>
      <Row gutter={[8, 4]}>
        <Col span={8}>
          <Item label="Data">
            {getFieldDecorator('data')(
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
              />,
            )}
          </Item>
        </Col>
        <Col span={8}>
          <Item label="Responsável">
            {getFieldDecorator('responsavel')(
              <Input placeholder="Responsável" />,
            )}
          </Item>
        </Col>
        <Col span={8}>
          <Item label="Status">
            {getFieldDecorator('status')(
              <Select>
                <Option value={1}>Agendado</Option>
                <Option value={2}>Em Espera</Option>
                <Option value={3}>Em Atendimento</Option>
                <Option value={4}>Atendimento Concluído</Option>
                <Option value={5}>Não Compareceu</Option>

              </Select>,
            )}
          </Item>
        </Col>
        <Col span={24}>
          <Item label="Observações">
            {getFieldDecorator('observacoes')(
              <TextArea rows={2} />,
            )}
          </Item>
        </Col>
      </Row>
    </Form>
  );
}

export default connect(
  ({ consulta }: Store) => ({ consultaStore: consulta }),
  (dispatch: any) => ({
    atualizaConsulta(consulta: Consulta): void {
      dispatch(mudou());
      dispatch(carregarConsulta(consulta));
    },
  }),
)(Form.create({
  name: 'consultaModalForm',
  onFieldsChange(props: any, changedFields: any) {
    const {
      atualizaConsulta,
      consultaStore,
    }: {
      atualizaConsulta: (consulta: Consulta) => void;
      consultaStore: ConsultaStore;
    } = props;

    const { consulta } = consultaStore;

    if (!consulta) return;

    const newConsulta = { ...consulta };

    const fieldName = Object.keys(changedFields)[0];

    if (fieldName === 'data') {
      newConsulta[fieldName] = changedFields[fieldName].value
        ? (changedFields[fieldName].value as Moment).toDate() : null;
    } else {
      newConsulta[fieldName] = changedFields[fieldName].value;
    }

    atualizaConsulta(newConsulta);
  },
  mapPropsToFields(props: any) {
    const { consultaStore }: { consultaStore: ConsultaStore } = props;

    const { consulta } = consultaStore;

    const createField = (fieldName: string) => {
      const field = consulta && consulta[fieldName];

      return ({
        [fieldName]: Form.createFormField({
          value: fieldName !== 'data' ? field : field && moment(field),
        }),
      });
    };

    return {
      ...createField('data'),
      ...createField('observacoes'),
      ...createField('responsavel'),
      ...createField('status'),
    };
  },
})(ConsultaModalForm));
