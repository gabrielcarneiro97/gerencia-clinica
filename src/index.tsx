import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import moment from 'moment';

import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import 'antd/dist/antd.min.css';

import './index.css';
import App from './App';

import store from './store/store';
import { initSender } from './services/ipcSender.service';
import LoadingScreen from './components/LoadingScreen';

moment.locale('pt-br');

function Index(): JSX.Element {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initSender().then(() => setLoading(false));
  }, []);

  return (
    <Provider store={store}>
      <ConfigProvider locale={ptBR}>
        {
          loading
          && <LoadingScreen />
        }
        {
          !loading
          && <App />
        }
        {/* <LoadingScreen /> */}
      </ConfigProvider>
    </Provider>
  );
}

ReactDOM.render(
  <Index />,
  document.getElementById('root'),
);
