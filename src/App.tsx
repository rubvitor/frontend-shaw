import React, { Component } from 'react';
import './App.css';
import Users from './components/User/Users';
import UserDetails from './components/User/UsersDetails'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
const logo = require('./logo.svg');

class App extends Component {
  render() {
    console.log("Host URL"+process.env.PUBLIC_URL);
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className="App">
        <header className="App-header">
          <img src={logo.default} className="App-logo" alt="logo" />
          <h1 className="App-title">Users Git Shaw</h1>
        </header>
          <Routes>
                <Route path= "/"  element={<Navigate replace to="/users" />}/>
                <Route path='/users' element={<Users />} />
                <Route path='/userdetails' element={<UserDetails />} />
          </Routes>
      </div>
    </BrowserRouter>
    );
  }
}

export default App;
