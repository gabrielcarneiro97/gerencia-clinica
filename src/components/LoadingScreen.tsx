import React from 'react';
import { Row, Col, Spin } from 'antd';


export default function LoadingScreen(): JSX.Element {
  return (
    <div>
      <Row type="flex" justify="space-around" align="middle" style={{ minHeight: '100vh' }}>
        <Col>
          <Spin size="large" />
        </Col>
      </Row>
    </div>
  );
}
