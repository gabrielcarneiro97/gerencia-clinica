import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import PacientesMain from './PacientesMain';
import AgendaMain from './AgendaMain';
import ConsultasMain from './ConsultasMain';
import ConfigMain from './ConfigMain';

export default function Router(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/pacientes" component={PacientesMain} />
      <Route exact path="/agenda" component={AgendaMain} />
      <Route exact path="/consultas" component={ConsultasMain} />
      <Route exact path="/config" component={ConfigMain} />
      <Redirect from="/" to="/pacientes" />
    </Switch>
  );
}
