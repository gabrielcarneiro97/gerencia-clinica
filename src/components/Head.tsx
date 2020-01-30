import React from 'react';
import { Typography } from 'antd';

const { Paragraph } = Typography;


export default function Head(): JSX.Element {
  return (
    <Paragraph
      strong
      style={{ color: '#FFF' }}
    >
      Minha Clínica
    </Paragraph>
  );
}
