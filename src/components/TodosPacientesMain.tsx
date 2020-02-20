import React from 'react';
import { Layout } from 'antd';
import TodosPacientesTable from './TodosPacientesTable';

export default function TodosPacientesMain(): JSX.Element {
  return (
    <Layout>
      <TodosPacientesTable />
    </Layout>
  );
}
