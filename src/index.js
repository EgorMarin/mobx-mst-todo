import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { store } from "./Store";
import './index.scss'

export const Context = createContext();

ReactDOM.render(
  <React.StrictMode>
    <Context.Provider value={store}>
      <App />
    </Context.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
