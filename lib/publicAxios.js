import axios from 'axios';

const api_url = `https://dummyjson.com/`;
axios.defaults.baseURL = api_url;

export const publicAxios = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});
