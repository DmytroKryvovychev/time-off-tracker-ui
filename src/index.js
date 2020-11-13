import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'moment/locale/ru';
import store from './redux/store';
import './i18n';

import App from './App';
import * as serviceWorker from './serviceWorker';

import './scss/app.scss';

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <Suspense fallback="Loading translation">
        <App />
      </Suspense>
    </Provider>
  </Router>,
  document.getElementById('root'),
);

serviceWorker.unregister();
