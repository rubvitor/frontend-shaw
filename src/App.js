import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Users from './components/User/Users';
import UserDetails from './UsersDetails'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

class App extends Component {
  render() {
    console.log("Host URL"+process.env.PUBLIC_URL);
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Users Git Shaw</h1>
        </header>
          <Routes>
                <Route exact path= "/"  element={<Navigate replace to="/users" />}/>
                <Route path='/users' element={<Users />} />
                <Route path='/userdetails' element={<UserDetails />} />
          </Routes>
      </div>
    </BrowserRouter>
    );
  }
}

export default App;
