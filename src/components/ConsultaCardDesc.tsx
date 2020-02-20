import React from 'react';
import moment from 'moment';

type propTypes = {
  telefone: string;
  dataHora: moment.Moment | null;
  responsavel: string;
}

export default function ConsultaCardDesc(props: propTypes): JSX.Element {
  const { telefone, dataHora, responsavel } = props;

  const pStyle: React.CSSProperties = { marginBottom: '3px' };

  return (
    <>
      <p style={pStyle}>
        {dataHora ? dataHora.format('HH:mm') : ''}
        &nbsp;
        -
        &nbsp;
        {responsavel}
      </p>
      <p style={pStyle}>
        {telefone}
        &nbsp;
      </p>
    </>
  );
}
