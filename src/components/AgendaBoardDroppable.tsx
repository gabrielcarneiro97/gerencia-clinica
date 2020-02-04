import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop, XYCoord } from 'react-dnd';
import { Card, Row } from 'antd';

import ConsultaCardDraggable from './ConsultaCardDraggable';

import { AgendaStore, removerBoardElement, adicionarBoardElement } from '../store/agenda';
import { Store } from '../store/store';
import { consultaDb } from '../services/db.service';

type propTypes = {
  title?: string;
  boardIndex: number;
  bgColor?: string;
}

const boardsY = 96;

const cardHeight = 87/* height */ + 12/* margin-bottom */;

const firstCardY = 31/* head */ + 8/* padding */;

const firstCardMidY = (cardHeight / 2) + firstCardY + boardsY;

export default function AgendaBoardDropabble(props: propTypes): JSX.Element {
  const {
    title = '',
    boardIndex,
  } = props;

  const dispatch = useDispatch();
  const { boards } = useSelector<Store, AgendaStore>((store) => store.agenda);

  const consultasId = boards[boardIndex];

  const cardsCounter = consultasId.length;

  const calcIndex = (dropPos: XYCoord | null): number => {
    if (!dropPos) return cardsCounter;

    const { y } = dropPos;

    let actualY = firstCardMidY;
    let counter = 0;

    if (cardsCounter === 0) return counter;

    while (actualY <= y) {
      counter += 1;
      actualY += cardHeight;
    }

    return counter;
  };

  const [, drop] = useDrop({
    accept: 'consulta',
    drop: async (item: any, monitor) => {
      const newBoard = boardIndex;
      const newElementIndex = calcIndex(monitor.getClientOffset());

      const oldBoard = item.boardIndex;
      const oldElementIndex = item.arrayIndex;

      const { consultaId } = item;

      dispatch(removerBoardElement(oldBoard, oldElementIndex));
      await consultaDb.updateStatus(consultaId, boardIndex + 1);
      dispatch(adicionarBoardElement(newBoard, newElementIndex, consultaId));
    },
  });

  return (
    <div ref={drop}>
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
    </div>
  );
}
