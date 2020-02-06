import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import PacientesMain from './PacientesMain';
import AgendaMain from './AgendaMain';

export default function Router(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/pacientes" component={PacientesMain} />
      <Route exact path="/agenda" component={AgendaMain} />

      <Redirect from="/" to="/pacientes" />
    </Switch>
  );
}
