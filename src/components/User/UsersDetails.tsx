import React, {Component} from 'react';
import { Card, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';
import { Enviroment } from '../../Enviroment';

export default class UserDetails extends Component<UserDetailsModel, UserDetailsModel> {

  constructor(props: any) {
    super(props);
    this.state = {
      id: '',
      page: 0,
      userDetails: {},
      repos: [],
      loading: false
    };
  }

  setStateIn(obj: any) {
    this.setState(obj);
  }

  componentDidMount() {
    const content = parse(location.search);
    this.setStateIn({id: content.id, page: content.page});
    this.getuserDetails(content.id);
    this.getUserRepos(content.id);
  }

  getuserDetails(id: any) {
    if (!id || id === '') {
      this.setStateIn({userDetails: {}});

      return;
    }

    this.setStateIn({loading: true});

    axios.get(`${Enviroment.urlBase}/users/${id}/details`).then(response => {
      let data = {};
      if (response && response.data && response.data) {
        data = response.data;
      }

      this.setStateIn({loading: false, userDetails: data});
    });
  }

  getUserRepos(id: any) {
    if (!id || id === '') {
      this.setStateIn({repos: {}});

      return;
    }

    this.setStateIn({loading: true});

    axios.get(`${Enviroment.urlBase}/users/${id}/repos`).then(response => {
      let data = {};
      if (response && response.data) {
        data = response.data;
      }

      this.setStateIn({loading: false, repos: data});
    });
  }

  render() {
    if (this.state.loading) {
      return (<p>Loading...</p>)
    }

    return (<div className="userDetails">
      <Card className="info centeralign">
        <Card.Header>
          <Card.Title className="h3">Details</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>Id : {this.state.userDetails?.id}</p>
          <p>Login : {this.state.userDetails?.login}</p>
          <p>Created Login : {this.state.userDetails?.created_at}</p>
        </Card.Body>
      </Card>
      <br/><br/>
      <Card>
        <Card.Body>
          <Link className="info" to={`/users?since=${this.state.page}`}>Back</Link>
        </Card.Body>
      </Card>
      {
            <Table striped bordered hover>
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
                  this.state.repos?.map((repo: any) =>
                      <tr key={repo.id}>
                        <td>{repo.id}</td>
                        <td>{repo.name}</td>
                        <td>{repo.url}</td>
                      </tr>
                  )
                }
              </tbody>
            </Table>
          }
    </div>
    )
  }
}

class UserDetailsModel {
  id?: '';
  page?: 0;
  userDetails?: any = {};
  repos?: [];
  loading?: false;
}