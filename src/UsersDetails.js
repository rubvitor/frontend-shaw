import React, {Component} from 'react';
import { Card } from 'react-bootstrap'
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default class UserDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      page: 0,
      userDetails: {},
      repos: []
    }
  }

  componentDidMount() {
    let query = useQuery();
    this.setState({id: query.get("id"), page: query.get("page")});

    this.getuserDetails(this.state.id);
  }

  getuserDetails(id) {
    if (!id || id === '') {
      this.setState({userDetails: {}});
      return;
    }

    axios.get(`https://users-git-shaw.herokuapp.com/users/${id}`).then(response => {
      let data = {};
      if (response && response.data && response.data.body && response.data.body.length && response.data.body.length > 0) {
        data = response.data;
      }

      this.setState({ userDetails: data.body });
    })
  }

  getuserRepos(id) {
    if (!id || id === '') {
      this.setState({userDetails: {}});
      return;
    }

    axios.get(`https://users-git-shaw.herokuapp.com/users/${id}/repos`).then(response => {
      let data = {};
      if (response && response.data && response.data.body && response.data.body.length && response.data.body.length > 0) {
        data = response.data;
      }

      this.setState({ repos: data.body });
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
          <Link className="info" to={"/users?since=" + this.state.current}>Back</Link>
        </Card.Body>
      </Card>
      {(() => {
          if (this.state.repos && this.state.repos.length > 0) {
            <table style={{"marginTop": "10px", "borderWidth":"1px", 'width': '100%', 'borderColor':"#aaaaaa", 'borderStyle':'solid'}}>
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
                      <tr>
                        <td>{repo.id}</td>
                        <td>{repo.name}</td>
                        <td>{repo.url}</td>
                      </tr>
                  )
                }
              </tbody>
            </table>
          }
      })()}
    </div>
    )
  }
}
