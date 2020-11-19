import axios from 'axios';
import moment from 'moment';

const BASE_URL = 'https://localhost:44381/';

const axiosApi = axios.create({
  baseURL: BASE_URL,
});

axiosApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

const convertDate = (date, lng) => {
  return lng === 'en'
    ? moment(date).format('MM/DD/YYYY').toString()
    : moment(date).format('DD.MM.YYYY').toString();
};

export { BASE_URL, axiosApi, convertDate };
