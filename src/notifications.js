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

    case '400':
      return toast.error('Bad request', defaultOptions);

    case 'Successful Login':
      return toast.success('Successful login', defaultOptions);

    default:
      return toast.warn('Something goes wrong', defaultOptions);
  }
};

export const notifyAdmin = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error('No connection with server', defaultOptions);

    case '400':
      return toast.error('Bad request', defaultOptions);

    case 'test':
      return toast.error(i18n.t('No connection with server'), defaultOptions);

    case 'Successful New User Adding':
      return toast.success('New user successfully added', defaultOptions);

    case 'New user failure':
      return toast.error('New user adding failed', defaultOptions);

    case 'Role changed success':
      return toast.success('Role changed successfully', defaultOptions);

    case 'Role changed failed':
      return toast.error('Failed to change role', defaultOptions);

    case 'User delete success':
      return toast.success('User deleted successfully', defaultOptions);

    case 'User delete failed':
      return toast.error('Failed to delete user', defaultOptions);

    default:
      return toast.warn('Something goes wrong', defaultOptions);
  }
};

export const notifyHome = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error('No connection with server', defaultOptions);

    case '400':
      return toast.error('Bad request', defaultOptions);

    default:
      return toast.warn('Something goes wrong', defaultOptions);
  }
};

export const notifyMyRequests = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error('No connection with server', defaultOptions);

    case '400':
      return toast.error('Bad request', defaultOptions);

    default:
      return toast.warn('Something goes wrong', defaultOptions);
  }
};

export const notifyNewRequest = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error('No connection with server', defaultOptions);

    case '400':
      return toast.error('Bad request', defaultOptions);

    case 'New request success':
      return toast.success('New request created', defaultOptions);

    case 'New request failed':
      return toast.error('Failed to create new request', defaultOptions);

    default:
      return toast.warn('Something goes wrong', defaultOptions);
  }
};

export const notifyOtherRequests = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error('No connection with server', defaultOptions);

    case '400':
      return toast.error('Bad request', defaultOptions);

    default:
      return toast.warn('Something goes wrong', defaultOptions);
  }
};

export const notifyReviewActions = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error('No connection with server', defaultOptions);
    case '400':
      return toast.error('Bad request', defaultOptions);
    case 'Approve success':
      return toast.success('Request successfully approved', defaultOptions);
    case 'Approve failed':
      return toast.error('Failed to approve request', defaultOptions);
    case 'Rejection success':
      return toast.success('Request successfully rejected', defaultOptions);
    case 'Rejection failed':
      return toast.error('Failed to reject request', defaultOptions);
    case 'No comment':
      return toast.error('Fill comment field', defaultOptions);
    default:
      return toast.warn('Something goes wrong', defaultOptions);
  }
};
