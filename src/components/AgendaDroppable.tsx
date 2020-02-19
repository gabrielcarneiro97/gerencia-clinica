import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop, XYCoord } from 'react-dnd';

import { AgendaStore, removerBoardElement, adicionarBoardElement } from '../store/agenda';
import { Store } from '../store/store';
import { graphql, hooks } from '../services/graphql.service';

type propTypes = {
  boardIndex: number;
  bgColor?: string;
  children: JSX.Element;
}

const boardsY = 96;

const cardHeight = 87/* height */ + 12/* margin-bottom */;

const firstCardY = 31/* head */ + 8/* padding */;

const firstCardMidY = (cardHeight / 2) + firstCardY + boardsY;

export default function AgendaBoardDropabble(props: propTypes): JSX.Element {
  const {
    boardIndex,
    children,
  } = props;

  const dispatch = useDispatch();
  const { boards } = useSelector<Store, AgendaStore>((store) => store.agenda);
  const [saveConsulta] = hooks.useSaveConsulta();

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
      saveConsulta({
        variables: {
          consulta: { id: consultaId as number, status: boardIndex + 1 },
        },
      });
      dispatch(adicionarBoardElement(newBoard, newElementIndex, consultaId));
    },
  });

  return (
    <div ref={drop} style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  );
}
