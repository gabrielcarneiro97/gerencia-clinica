import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Modal,
  Icon,
  Row,
  Col,
} from 'antd';

import ConsultaModalForm from './ConsultaModalForm';
import ConsultaModalProcedimentosTable from './ConsultaModalProcedimentosTable';

import { carregarInfos, carregarProcedimentos, limparConsulta } from '../store/consulta';
import ConsultaModalSaveButton from './ConsultaModalSaveButton';

import { graphql, methods } from '../services/graphql.service';

import { Consulta } from '../types';
import ConsultaModalNovaButton from './ConsultaModalNovaButton';

type propTypes = {
  id?: number;
  pacienteId?: number | null;
  buttonSize?: string | number;
  icon?: string;
  iconRotate?: number;
  buttonFill?: boolean;
  emitter?: string;
  visible?: boolean;
  saveEnd?: Function;
}

export default function ConsultaModal(props: propTypes): JSX.Element {
  const {
    icon = 'info-circle',
    iconRotate = 0,
    buttonSize = 20,
    buttonFill = false,
    emitter,
    visible: visibleProp,
    saveEnd,
    id,
    pacienteId,
  } = props;

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(visibleProp || false);

  useEffect(() => {
    if (visible && !id && pacienteId) {
      const consulta: Consulta = {
        pacienteId,
        status: 1,
      };
      dispatch(carregarInfos(consulta));
    } else if (visible && id) {
      graphql.consulta.getById(id).then(async (consulta) => {
        const procedimentos = await methods.consulta.getProcedimentos(consulta);

        dispatch(carregarProcedimentos(procedimentos));
        dispatch(carregarInfos(consulta));
      });
    } else {
      dispatch(limparConsulta());
    }
  }, [visible]);

  const showModal = (): void => setVisible(true);
  const hideModal = (): void => setVisible(false);

  const footer = (
    <Row type="flex" justify="end" gutter={8}>
      <Col>
        <ConsultaModalNovaButton pacienteId={pacienteId} />
      </Col>
      <Col>
        <ConsultaModalSaveButton
          onEnd={(): void => {
            hideModal();
            if (saveEnd) saveEnd();
          }}
          emitter={emitter}
        />
      </Col>
    </Row>
  );

  return (
    <>

      <Button
        shape="circle"
        type="link"
        style={{ fontSize: buttonSize }}
        onClick={showModal}
      >
        <Icon type={icon} rotate={iconRotate} theme={buttonFill ? 'filled' : 'outlined'} />
      </Button>

      <Modal
        title={(
          <div style={{ fontSize: 'large' }}>
            Consulta
          </div>
        )}
        width={700}
        footer={footer}
        visible={visible}
        onCancel={hideModal}
        destroyOnClose
        centered
      >
        <ConsultaModalForm />
        <ConsultaModalProcedimentosTable />
      </Modal>
    </>
  );
}
