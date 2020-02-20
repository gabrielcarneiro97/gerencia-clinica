import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'antd';

import ConsultaModalForm from './ConsultaModalForm';
import ConsultaModalProcedimentosTable from './ConsultaModalProcedimentosTable';

import { carregarConsulta, limparConsulta } from '../store/consulta';

import { graphql } from '../services/graphql.service';

import { Consulta } from '../types';
import ConsultaModalFooter from './ConsultaModalFooter';
import ConsultaModalButton from './ConsultaModalButton';

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

function useComponent(props: propTypes) {
  const {
    visible: visibleProp,
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
        procedimentos: [],
      };
      dispatch(carregarConsulta(consulta));
    } else if (visible && id) {
      graphql.consulta.getById(id).then(async (consulta) => {
        dispatch(carregarConsulta(consulta));
      });
    } else {
      dispatch(limparConsulta());
    }
  }, [visible]);

  const showModal = (): void => setVisible(true);
  const hideModal = (): void => setVisible(false);

  return {
    state: {
      visible,
    },
    methods: {
      showModal,
      hideModal,
    },
  };
}

export default function ConsultaModal(props: propTypes): JSX.Element {
  const {
    icon,
    iconRotate,
    buttonSize,
    buttonFill,
    emitter,
    saveEnd,
    pacienteId,
  } = props;

  const { state, methods } = useComponent(props);

  const { visible } = state;
  const { showModal, hideModal } = methods;

  return (
    <>
      <ConsultaModalButton
        showModal={showModal}
        icon={icon}
        rotate={iconRotate}
        size={buttonSize}
        fill={buttonFill}
      />

      <Modal
        title={(
          <div style={{ fontSize: 'large' }}>
            Consulta
          </div>
        )}
        width={700}
        footer={(
          <ConsultaModalFooter
            hideModal={hideModal}
            saveEnd={saveEnd}
            pacienteId={pacienteId}
            emitter={emitter}
          />
        )}
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
