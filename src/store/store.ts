import { createStore, combineReducers } from 'redux';

import paciente, { PacienteStore } from './paciente';
import consulta, { ConsultaStore } from './consulta';

export type Store = {
  paciente: PacienteStore;
  consulta: ConsultaStore;
}

const reducer = combineReducers({
  paciente,
  consulta,
});

export default createStore(reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__
  && (window as any).__REDUX_DEVTOOLS_EXTENSION__());
