import React, {Component} from 'react';
import { Card } from 'react-bootstrap'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';
import { Enviroment } from './Enviroment';

export default class UserDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      page: 0,
      userDetails: {},
      repos: []
    };
  }

  componentDidMount() {
    const content = parse(location.search);
    this.state.id = content.id;
    this.state.page = content.page;
    this.setState(this.state);
    this.getuserDetails(content.id);
    this.getUserRepos(content.id);
  }

  getuserDetails(id) {
    if (!id || id === '') {
      this.state.userDetails = {};
      this.setState(this.state);

      return;
    }

    axios.get(`${Enviroment.urlBase}/users/${id}/details`).then(response => {
      let data = {};
      if (response && response.data && response.data) {
        data = response.data;
      }

      this.state.userDetails = data;
      this.setState(this.state);
    })
  }

  getUserRepos(id) {
    if (!id || id === '') {
      this.state.repos = {};
      this.setState(this.state);

      return;
    }

    axios.get(`${Enviroment.urlBase}/users/${id}/repos`).then(response => {
      let data = {};
      if (response && response.data) {
        data = response.data;
      }

      this.state.repos = data;
      this.setState(this.state);
    })
  }

  render() {
    if (!this.state.userDetails)
      return (<p>Loading Data</p>)
    return (<div className="userDetails">
      <Card className="info centeralign">
        <Card.Header>
          <Card.Title className="h3">Details</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>Id : {this.state.userDetails.id}</p>
          <p>Login : {this.state.userDetails.login}</p>
          <p>Created Login : {this.state.userDetails.created_at}</p>
        </Card.Body>
      </Card>
      <br/><br/>
      <Card>
        <Card.Body>
          <Link className="info" to={`/users?since=${this.state.page}`}>Back</Link>
        </Card.Body>
      </Card>
      {
            <table style={{"marginTop": "30px", "borderWidth":"1px", 'width': '100%', 'borderColor':"#aaaaaa", 'borderStyle':'solid'}}>
            <caption>Repositories</caption>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>URL</th>
              </tr>
            </thead>
              <tbody>
                {
                  this.state.repos.map(repo =>
                      <tr key={repo.id}>
                        <td>{repo.id}</td>
                        <td>{repo.name}</td>
                        <td>{repo.url}</td>
                      </tr>
                  )
                }
              </tbody>
            </table>
          }
    </div>
    )
  }
}