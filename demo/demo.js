'use strict';

require('file-loader?name=index.html!./index.html');

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import DemoApp from './demo-app';

function render(App) {
  // AppContainer enables react-hot-loader
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('main')
  );
}

render(DemoApp);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./demo-app', () => {
    const NextApp = require('./demo-app').default;
    render(NextApp);
  });
}
