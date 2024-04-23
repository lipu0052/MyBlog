import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // Import your Redux store
import './index.css';

import App from './App'; // Assuming App is your root component
import ThemeProvider from './components/ThemeProvide'; // Import your ThemeProvider component

ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider> {/* Wrap your App with ThemeProvider */}
        <App />
      </ThemeProvider>
    </Provider>

  ,
  document.getElementById('root')
);
