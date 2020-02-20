import React from 'react';
import { Row, Col } from 'antd';
import ConsultaModalNovaButton from './ConsultaModalNovaButton';
import ConsultaModalSaveButton from './ConsultaModalSaveButton';

type propTypes = {
  pacienteId?: number | null;
  hideModal: Function;
  saveEnd?: Function;
  emitter?: string;
};

export default function ConsultaModalFooter(props: propTypes): JSX.Element {
  const {
    pacienteId,
    hideModal,
    saveEnd,
    emitter,
  } = props;

  return (
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
}
