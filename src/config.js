import axios from 'axios';
import moment from 'moment';
import i18n from './i18n';

const BASE_URL = 'https://timeofftrackerwebapi2020.azurewebsites.net/';

const axiosApi = axios.create({
  baseURL: BASE_URL,
});

axiosApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  config.headers['Accept-Language'] = i18n.language;
  return config;
});

const convertDate = (date, lng) => {
  return lng === 'en'
    ? moment(date).format('MM/DD/YYYY').toString()
    : moment(date).format('DD.MM.YYYY').toString();
};

export { BASE_URL, axiosApi, convertDate };
