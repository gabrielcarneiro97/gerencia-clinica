import React from 'react';
import { Row } from 'antd';

import ConfigPlanilhaUploadBtn from './ConfigPlanilhaUploadBtn';

export default function ConfigPlanilhaUpload(): JSX.Element {
  return (
    <Row>
      <ConfigPlanilhaUploadBtn onUpload={console.log} />
    </Row>
  );
}
