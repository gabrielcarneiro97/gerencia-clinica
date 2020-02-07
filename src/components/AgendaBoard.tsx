import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Row } from 'antd';

import { AgendaStore } from '../store/agenda';
import { Store } from '../store/store';

import ConsultaCardDraggable from './ConsultaCardDraggable';

type propTypes = {
  boardIndex: number;
  title?: string;
}

export default function AgendaBoard(props: propTypes) {
  const {
    title = '',
    boardIndex,
  } = props;

  const { boards } = useSelector<Store, AgendaStore>((store) => store.agenda);

  const consultasId = boards[boardIndex];

  return (
    <Card
      style={{ borderRadius: 5, background: '#fafafa' }}
      bodyStyle={{ minHeight: 500, padding: 8 }}
    >
      <Row style={{ marginBottom: 10, fontWeight: 600 }}>
        {title}
      </Row>
      <Row>
        {consultasId.map(
          (id, index) => (
            <ConsultaCardDraggable
              consultaId={id}
              key={id}
              boardIndex={boardIndex}
              arrayIndex={index}
            />
          ),
        )}
      </Row>
    </Card>
  );
}
