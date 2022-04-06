import React, {Component} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { parse, exclude } from 'query-string';
import { Enviroment } from '../../Enviroment';

export default class Users extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedUser: '',
      userList: [],
      prev: 0,
      next: 1,
      current: 0,
      errorMsg: '',
      loading: false
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData(url) {
    let page = 0;
    if (!url) {
      url = `${Enviroment.urlBase}/users?since=`;
      const content = parse(location.search);

      if (content) {
        url += content.since;
        page = Number(content.since);
      } else {
        url += '0';
      }
    }

    this.state.errorMsg = '';
    this.state,loading = true;
    this.setState(this.state);

    axios.get(url).then(response => {
      let data = [];
      if (response && response.data && response.data.body && response.data.body.length && response.data.body.length > 0) {
        data = response.data.body;
      }
      else {
        this.setState({errorMsg: response.data.body.message});
        return;
      }

      page = Number(response.data.current);
      this.state,loading = false;
      this.state.userList = data;
      this.state.prev = response.data.previous;
      this.state.next = response.data.next;
      this.state.current = page;

      this.setState(this.state);
    });
  };

  render() {
    if (this.state.errorMsg !== '') {
      return (<p>{this.state.errorMsg}</p>)
    }

    if (!this.state.userList || this.state.userList.length === 0) {
      return (<p>Without results</p>)
    }

    if (this.state.loading) {
      return (<p>Loading...</p>)
    }

    return (<div className="addmargin">
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
          this.state.userList.map(user =>
              <tr key={user.id} style={{"cursor": "pointer"}}>
                <td>{user.id}</td>
                <td>{user.login}</td>
                <td>
                  <Link variant="info" to={`/userdetails?id=${user.id}&page=${this.state.current}`}>
                   Details
                  </Link>
                </td>
              </tr>
          )
        }
          </tbody>
        </Table>
        <div style={{"width":"100%", "borderWidth":"1px", 'width': '100%', 'borderColor':"#aaaaaa", 'borderStyle':'solid'}}>
          <button type='button' onClick={() => this.getUserData(this.state.prev)}>Prev</button>
          <label style={{"margin":"5px"}}>{this.state.current}</label>
          <button type='button' onClick={() => this.getUserData(this.state.next)}>Next</button>
        </div>
      </div>
    </div>)
  }

}
