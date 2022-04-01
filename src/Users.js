import React, {Component} from 'react';
import {Card, Button, Table } from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from 'axios';
import {  } from './App'

export default class Users extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedUser: '',
      userList: [],
      prev: 0,
      next: 1,
      current: 0,
      errorMsg: ''
    }
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData(url = 'https://users-git-shaw.herokuapp.com/users?since=0') {
    this.setState({errorMsg: ''});
    axios.get(url).then(response => {
      let data = [];
      if (response && response.data && response.data.body && response.data.body.length && response.data.body.length > 0) {
        data = response.data;
      }
      else {
        this.setState({errorMsg: data.body.message});
        return;
      }

      this.setState({userList: data.body, prev: data.previous, next: data.next, current: data.current});
    });
  };

  render() {
    if (this.state.errorMsg !== '') {
      return (<p>{this.state.errorMsg}</p>)
    }

    if (!this.state.userList || this.state.userList.length === 0) {
      return (<p>Without results</p>)
    }

    return (<div className="addmargin">
      <div className="col-md-12">
      <table style={{"borderWidth":"1px", 'width': '100%', 'borderColor':"#aaaaaa", 'borderStyle':'solid'}}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Login</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
        {
          this.state.userList.map(user =>
              <tr style={{"cursor": "pointer"}}>
                <td>{user.id}</td>
                <td>{user.login}</td>
                <td>
                  <Link variant="info" to={"/userdetails?id=" + user.id + "&page=" + this.state.current}>
                   Details
                  </Link>
                </td>
              </tr>
          )
        }
          </tbody>
        </table>
        <div style={{"width":"100%", "borderWidth":"1px", 'width': '100%', 'borderColor':"#aaaaaa", 'borderStyle':'solid'}}>
          <button type='button' onClick={() => this.getUserData(this.state.prev)}>Prev</button>
          <label style={{"margin":"5px"}}>{this.state.current}</label>
          <button type='button' onClick={() => this.getUserData(this.state.next)}>Next</button>
        </div>
      </div>
    </div>)
  }

}
