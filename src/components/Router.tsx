import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import PacientesMain from './PacientesMain';
import AgendaMain from './AgendaMain';
import ConsultasMain from './ConsultasMain';

export default function Router(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/pacientes" component={PacientesMain} />
      <Route exact path="/agenda" component={AgendaMain} />
      <Route exact path="/consultas" component={ConsultasMain} />
      <Redirect from="/" to="/pacientes" />
    </Switch>
  );
}
