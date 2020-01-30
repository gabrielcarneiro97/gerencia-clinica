import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Store } from '../store/store';
import ConsultaModalSaveButton from './ConsultaModalSaveButton';

import { consultaMethods, consultaDb } from '../services/db.service';

import { Consulta } from '../types';

type propTypes = {
  id?: number;
  buttonConfig?: {
    size?: string;
    icon?: string;
    filled?: boolean;
  };
  emitter?: string;
  visible?: boolean;
  saveEnd?: Function;
}

export default function ConsultaModal(props: propTypes): JSX.Element {
  const {
    buttonConfig = {
      size: '20px',
      icon: 'info-circle',
      filled: false,
    }, id, emitter, visible: visibleProp, saveEnd,
  } = props;

  const dispatch = useDispatch();
  const { paciente } = useSelector<Store, Store>((store) => store);
  const pacienteId = paciente.infosPessoais?.id;

  const [visible, setVisible] = useState(visibleProp || false);

  useEffect(() => {
    if (visible && !id && pacienteId) {
      const consulta: Consulta = {
        pacienteId,
        status: 1,
      };
      dispatch(carregarInfos(consulta));
    } else if (visible && id) {
      consultaDb.getById(id).then(async (consulta) => {
        const procedimentos = await consultaMethods.getProcedimentos(consulta);

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
    <Row type="flex" justify="end">
      <Col>
        <ConsultaModalSaveButton
          onEnd={() => {
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
        style={{ fontSize: buttonConfig.size }}
        onClick={showModal}
      >
        <Icon type={buttonConfig.icon} theme={buttonConfig.filled ? 'filled' : 'outlined'} />
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
