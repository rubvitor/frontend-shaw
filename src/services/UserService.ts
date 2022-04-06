import axios from 'axios';
import { Enviroment } from '../Enviroment';

export default class UserDetails {
    getUserDetails(id: string) {
        return axios.get(`${Enviroment.urlBase}/users/${id}/details`);
    }

    getUserRepos(id: string) {
        axios.get(`${Enviroment.urlBase}/users/${id}/repos`);
    }

    getUsers(url: string) {
        axios.get(url);
    }
}