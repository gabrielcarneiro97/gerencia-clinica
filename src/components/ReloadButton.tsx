import React, { useState } from 'react';
import { Button, Icon, Popover } from 'antd';

type propTypes = {
  onClick: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export default function ReloadButton(props: propTypes): JSX.Element {
  const { onClick } = props;
  const [spin, setSpin] = useState(false);

  const spinOn = () => setSpin(true);
  const spinOff = () => setSpin(false);

  return (
    <Popover content="Atualizar">
      <Button
        type="primary"
        onMouseEnter={spinOn}
        onMouseLeave={spinOff}
        onClick={onClick}
      >
        <Icon type="reload" spin={spin} />
      </Button>
    </Popover>
  );
}
