import React from 'react';
import { HashRouter } from 'react-router-dom';

import './App.css';

import Main from './components/Main';

export default function App(): JSX.Element {
  return (
    <HashRouter>
      <Main />
    </HashRouter>
  );
}
