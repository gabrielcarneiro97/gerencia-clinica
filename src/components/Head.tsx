import React from 'react';
import { Typography } from 'antd';
import { dbInit } from '../db/db.service';

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
