import React from 'react';
import ReactDOM from 'react-dom';
import { RMWCProvider as Provider } from 'rmwc/Provider';
import App from './components/App';

ReactDOM.render(
    <Provider>
        <App />
    </Provider>,
    document.getElementById('root')
);
