/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React, { useState } from 'react';

export default function AgendaBoardDrawerDroppable() {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const createTimer = () => {
    if (!timer) {
      setTimer(setTimeout(() => {
        console.log('hey');
      }, 2000));
    }
  };

  const destroyTimer = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  };

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onMouseEnter={createTimer}
      onMouseOut={destroyTimer}
    >
      Teste
    </div>
  );
}
