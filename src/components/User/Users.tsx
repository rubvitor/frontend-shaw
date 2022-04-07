import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { parse } from 'query-string';
import { Enviroment } from '../../Enviroment';

export default class Users extends Component<UserModel, UserModel> {

  userInput: string = '';
  constructor(props: any) {
    super(props);
    this.userInput = '';
    this.state = {
      selectedUser: '',
      userList: [],
      prev: '',
      next: '',
      current: 0,
      errorMsg: '',
      loading: true
    };
  }

  setStateIn(obj: any) {
    this.setState(obj);
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData(url: string = '') {
    let page = 0;
    if (!url || url === '') {
      url = `${Enviroment.urlBase}/users?since=`;
      const content = parse(location.search);

      if (content && content.since) {
        url += content.since;
        page = Number(content.since);
      } else {
        url += '0';
      }
    }

    this.setStateIn({ errorMsg: '', loading: true });
    axios.get(url).then(response => {
      let data = [];
      if (response && response.data && response.data.body && response.data.body.length && response.data.body.length > 0) {
        data = response.data.body;
      }
      else {
        this.setStateIn({ errorMsg: response.data.body.message });
        return;
      }

      page = Number(response.data.current);
      const stateTemp = {
        loading: false,
        userList: data,
        prev: response.data.previous,
        next: response.data.next,
        current: page,
      };

      this.setStateIn(stateTemp);
    });
  };

  getUserDataByName() {
    if (!this.userInput || this.userInput.trim() === '') {
      alert('Please, set the field User. Is Empty.');
    }
    axios.get(`${Enviroment.urlBase}/users/${this.userInput}/details`).then(response => {
      let data = [];
      if (response && response.data) {
        data = [response.data];
      }
      else {
        this.setStateIn({ errorMsg: response.data.message });
        return;
      }

      const stateTemp = {
        loading: false,
        userList: data,
        prev: '',
        next: '',
        current: 0,
      };

      this.setStateIn(stateTemp);
    });
  }

  getInputValue = (event: any) => {
    this.userInput = event.target.value;
  };

  onKeyUp = (event: any) => {
    if (event.keyCode === 13) {
      this.getUserDataByName();
    }
  }

  render() {
    if (this.state.errorMsg !== '') {
      return (<p>{this.state.errorMsg}</p>)
    }

    let loadingDiv: any;
    if (this.state.loading) {
      loadingDiv = <p>Loading...</p>;
    }

    if (!this.state.userList || this.state.userList.length === 0) {
      return (<p>Without results</p>)
    }

    return (<div className="addmargin">
      {loadingDiv}
      <div className="col-md-12">
        <div className="col-md-12" style={{ 'margin': '10px' }}>
          <label style={{ 'margin': '3px' }}>Search by User:</label>
          <input type="text" defaultValue={this.userInput} onKeyUp={this.onKeyUp} onChange={this.getInputValue} style={{ 'margin': '3px' }} />
          <button type='button' style={{ 'margin': '3px' }} onClick={() => this.getUserDataByName()}>Search</button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>ID</th>
              <th>Login</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.userList.map((user: any) =>
                <tr key={user.id} style={{ "cursor": "pointer" }}>
                  <td><img width={'50px'} src={user.avatar_url} /></td>
                  <td>{user.id}</td>
                  <td>{user.login}</td>
                  <td>
                    <Link to={`/userdetails?id=${user.login}&page=${this.state.current}`}>
                      Details
                    </Link>
                  </td>
                </tr>
              )
            }
          </tbody>
        </Table>
        <div style={{ "width": "100%", "borderWidth": "1px", 'borderColor': "#aaaaaa", 'borderStyle': 'solid' }}>
          <button type='button' onClick={() => this.getUserData(this.state.prev)}>Prev</button>
          <label style={{ "margin": "5px" }}>{this.state.current}</label>
          <button type='button' onClick={() => this.getUserData(this.state.next)}>Next</button>
        </div>
      </div>
    </div>)
  }

}

class UserModel {
  selectedUser?= '';
  userList?= [];
  prev?= '';
  next?= '';
  current?= 0;
  errorMsg?= '';
  loading?= false;
}
