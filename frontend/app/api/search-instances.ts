import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://harishkamavaram--backend-fastapiapp-fastapi-app.modal.run/b',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
export default instance;
