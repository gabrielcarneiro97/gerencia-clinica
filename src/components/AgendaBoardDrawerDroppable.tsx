/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState } from 'react';
import { Drawer } from 'antd';

import AgendaDroppable from './AgendaDroppable';
import AgendaBoardDroppable from './AgendaBoardDroppable';

type propTypes = {
  boardIndex: number;
  title?: string;
}

export default function AgendaBoardDrawerDroppable(props: propTypes) {
  const { boardIndex, title = '' } = props;

  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <AgendaDroppable boardIndex={boardIndex}>
      <div
        style={{ width: '100%', height: '100%' }}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <Drawer
          placement="left"
          onClose={hide}
          visible={visible}
          getContainer=".agenda-boards"
          style={{ position: 'absolute' }}
          mask={false}
          closable={false}
          width={150}
          bodyStyle={{ padding: 0, background: 'none' }}
        >
          <div
            style={{ width: '100%', height: '100%' }}
            onMouseLeave={hide}
          >
            <AgendaBoardDroppable boardIndex={boardIndex} title={title} />
          </div>
        </Drawer>
      </div>
    </AgendaDroppable>
  );
}
