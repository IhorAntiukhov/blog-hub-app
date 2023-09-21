import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

const TOPICS_LIST = ['IT', 'Education', 'Gaming', 'Science', 'Sports', 'Travel']

const el = document.querySelector('#root');
const root = createRoot(el);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

export default TOPICS_LIST;
