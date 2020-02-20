import React, { MouseEvent } from 'react';
import { Button, Icon } from 'antd';

type propTypes = {
  showModal: (event: MouseEvent) => void;
  size?: string | number;
  icon?: string;
  rotate?: number;
  fill?: boolean;
}

export default function ConsultaModalButton(props: propTypes) {
  const {
    icon = 'info-circle',
    rotate = 0,
    size = 20,
    fill = false,
    showModal,
  } = props;

  return (
    <Button
      shape="circle"
      type="link"
      style={{ fontSize: size }}
      onClick={showModal}
    >
      <Icon type={icon} rotate={rotate} theme={fill ? 'filled' : 'outlined'} />
    </Button>
  );
}
