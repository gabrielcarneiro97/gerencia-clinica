/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

import { pacienteGrupoDb } from '../services/db.service';
import { PacienteGrupo } from '../types';

const { Option } = Select;

const PacienteGrupoSelect = React.forwardRef((props: any, ref): JSX.Element => {
  const { tipo } = props;

  const [grupos, setGrupos] = useState<PacienteGrupo[]>([]);

  useEffect(() => {
    pacienteGrupoDb.getAll().then((gs) => {
      setGrupos(gs.filter((g) => g.tipo === tipo));
    });
  }, []);

  return (
    <Select ref={ref} disabled={grupos.length === 0} {...props}>
      {(() => grupos.map((g) => <Option value={g.id} key={g.id}>{g.descricao}</Option>))()}
    </Select>
  );
});

export default PacienteGrupoSelect;
