/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

import { hooks } from '../services/graphql.service';
import { PacienteGrupo } from '../types';

const { Option } = Select;

function useComponent(props: any) {
  const { tipo } = props;

  const [grupos, setGrupos] = useState<PacienteGrupo[]>([]);

  const { data, loading } = hooks.usePacienteGrupos();

  useEffect(() => {
    if (data && !loading) {
      const { pacienteGrupos } = data;
      setGrupos(pacienteGrupos.filter((g) => g.tipo === tipo));
    }
  }, [data, loading]);

  return {
    state: {
      grupos,
      loading,
    },
  };
}

const PacienteGrupoSelect = React.forwardRef((props: any, ref): JSX.Element => {
  const { state } = useComponent(props);
  const { grupos, loading } = state;

  return (
    <Select ref={ref} disabled={grupos.length === 0 || loading} {...props}>
      {(() => grupos.map((g) => <Option value={g.id} key={g.id}>{g.descricao}</Option>))()}
    </Select>
  );
});

export default PacienteGrupoSelect;
