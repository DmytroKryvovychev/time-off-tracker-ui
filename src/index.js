import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './i18n';

import App from './App';
import * as serviceWorker from './serviceWorker';

import './scss/app.scss';

ReactDOM.render(
  <Router>
    <Suspense fallback="Loading translation">
      <App />
    </Suspense>
  </Router>,
  document.getElementById('root'),
);

serviceWorker.unregister();
