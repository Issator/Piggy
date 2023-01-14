import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './bootstrap.scss';
import 'bootstrap/dist/js/bootstrap.bundle.js'
import { UserProvider } from './Context/User';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
        <App />
    </UserProvider>
);
