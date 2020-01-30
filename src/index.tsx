import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// import moment from 'moment';
import 'antd/dist/antd.min.css';

import './index.css';
import App from './App';

import store from './store/store';
import { dbInit } from '../electron/backend/db/db.service';

// moment.locale('pt-br');

dbInit().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      {/* <ConfigProvider locale={ptBR}> */}
      <App />
      {/* </ConfigProvider> */}
    </Provider>,
    document.getElementById('root'),
  );
});
