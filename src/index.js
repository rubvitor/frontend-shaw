import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { useLocation } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
registerServiceWorker();

function locations() {
    const {id, page } = useLocation();
    return { id: id, page: page };
}
