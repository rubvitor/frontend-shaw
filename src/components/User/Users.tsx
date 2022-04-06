import React, {Component } from 'react';
import { Link } from "react-router-dom";
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { parse } from 'query-string';
import { Enviroment } from '../../Enviroment';

export default class Users extends Component<UserModel, UserModel> {

  constructor(props: any) {
    super(props);
    this.state = {
      selectedUser: '',
      userList: [],
      prev: '',
      next: '',
      current: 0,
      errorMsg: '',
      loading: false
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

    this.setStateIn({ errorMsg: '', loading: true});
    axios.get(url).then(response => {
      let data = [];
      if (response && response.data && response.data.body && response.data.body.length && response.data.body.length > 0) {
        data = response.data.body;
      }
      else {
        this.setStateIn({errorMsg: response.data.body.message});
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

  render() {
    if (this.state.errorMsg !== '') {
      return (<p>{this.state.errorMsg}</p>)
    }

    if (!this.state.userList || this.state.userList.length === 0) {
      return (<p>Without results</p>)
    }

    let loadingDiv: any;
    if (this.state.loading) {
      loadingDiv = <p>Loading...</p>;
    }
    return (<div className="addmargin">
      {loadingDiv}
      <div className="col-md-12">
      <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Login</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
        {
          this.state.userList.map((user: any) =>
              <tr key={user.id} style={{"cursor": "pointer"}}>
                <td>{user.id}</td>
                <td>{user.login}</td>
                <td>
                  <Link  to={`/userdetails?id=${user.id}&page=${this.state.current}`}>
                   Details
                  </Link>
                </td>
              </tr>
          )
        }
          </tbody>
        </Table>
        <div style={{"width":"100%", "borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid'}}>
          <button type='button' onClick={() => this.getUserData(this.state.prev)}>Prev</button>
          <label style={{"margin":"5px"}}>{this.state.current}</label>
          <button type='button' onClick={() => this.getUserData(this.state.next)}>Next</button>
        </div>
      </div>
    </div>)
  }

}

class UserModel {
  selectedUser? = '';
  userList? = [];
  prev? = '';
  next? = '';
  current? =  0;
  errorMsg? = '';
  loading? = false;
}
