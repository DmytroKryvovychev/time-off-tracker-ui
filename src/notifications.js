import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import i18n from './i18n';

const defaultOptions = {
  position: 'bottom-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const notifyLogin = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error('No connection with server', defaultOptions);
      break;
    case '400':
      return toast.error('Bad request', defaultOptions);
      break;
    case 'Successful Login':
      return toast.success('Successful login', defaultOptions);
      break;
    default:
      return toast.warn('Something goes wrong', defaultOptions);
      break;
  }
};

export const notifyAdmin = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error('No connection with server', defaultOptions);
      break;
    case '400':
      return toast.error('Bad request', defaultOptions);
      break;
    case 'test':
      return toast.error(i18n.t('No connection with server'), defaultOptions);
      break;
    case 'Successful New User Adding':
      return toast.success('New user successfully added', defaultOptions);
      break;
    case 'New user failure':
      return toast.error('New user adding failed', defaultOptions);
      break;
    case 'Role changed success':
      return toast.success('Role changed successfully', defaultOptions);
      break;
    case 'Role changed failed':
      return toast.error('Failed to change role', defaultOptions);
      break;
    case 'User delete success':
      return toast.success('User deleted successfully', defaultOptions);
      break;
    case 'User delete failed':
      return toast.error('Failed to delete user', defaultOptions);
      break;
    default:
      return toast.warn('Something goes wrong', defaultOptions);
      break;
  }
};

export const notifyHome = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error('No connection with server', defaultOptions);
      break;
    case '400':
      return toast.error('Bad request', defaultOptions);
      break;
    default:
      return toast.warn('Something goes wrong', defaultOptions);
      break;
  }
};

export const notifyMyRequests = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error('No connection with server', defaultOptions);
      break;
    case '400':
      return toast.error('Bad request', defaultOptions);
      break;
    default:
      return toast.warn('Something goes wrong', defaultOptions);
      break;
  }
};

export const notifyNewRequest = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error('No connection with server', defaultOptions);
      break;
    case '400':
      return toast.error('Bad request', defaultOptions);
      break;
    case 'New request success':
      return toast.success('New request created', defaultOptions);
      break;
    case 'New request failed':
      return toast.error('Failed to create new request', defaultOptions);
      break;
    default:
      return toast.warn('Something goes wrong', defaultOptions);
      break;
  }
};
