import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import moment from 'moment';

import { ConfigProvider as AntdProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import 'antd/dist/antd.min.css';

import App from './App';

import store from './store/store';
import waitServer from './services/server.service';
import LoadingScreen from './components/LoadingScreen';

moment.locale('pt-br');

function Index(): JSX.Element {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    waitServer().then(() => setLoading(false));
  }, []);

  return (
    <ReduxProvider store={store}>
      <AntdProvider locale={ptBR}>
        {
          loading
          && <LoadingScreen />
        }
        {
          !loading
          && <App />
        }
        {/* <LoadingScreen /> */}
      </AntdProvider>
    </ReduxProvider>
  );
}

ReactDOM.render(
  <Index />,
  document.getElementById('root'),
);
