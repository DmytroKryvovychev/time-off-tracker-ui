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
      return toast.error(i18n.t('notifications:NoConnection'), defaultOptions);

    case '400':
      return toast.error(i18n.t('notifications:BadRequest'), defaultOptions);

    case 'Successful Login':
      return toast.success(i18n.t('notifications:LoginSuccess'), defaultOptions);

    default:
      return toast.warn(i18n.t('notifications:SomethingWrong'), defaultOptions);
  }
};

export const notifyAdmin = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error(i18n.t('notifications:NoConnection'), defaultOptions);

    case '400':
      return toast.error(i18n.t('notifications:BadRequest'), defaultOptions);

    case 'test':
      return toast.error(i18n.t('notifications:NoConnection'), defaultOptions);

    case 'Successful New User Adding':
      return toast.success(i18n.t('notifications:NewUserAdded'), defaultOptions);

    case 'New user failure':
      return toast.error(i18n.t('notifications:NewUserFail'), defaultOptions);

    case 'Role changed success':
      return toast.success(i18n.t('notifications:ChangeRole'), defaultOptions);

    case 'Role changed failed':
      return toast.error(i18n.t('notifications:ChangeRoleFail'), defaultOptions);

    case 'User delete success':
      return toast.success(i18n.t('notifications:DeleteUser'), defaultOptions);

    case 'User delete failed':
      return toast.error(i18n.t('notifications:DeleteUserFail'), defaultOptions);

    default:
      return toast.warn(i18n.t('notifications:SomethingWrong'), defaultOptions);
  }
};

export const notifyHome = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error(i18n.t('notifications:NoConnection'), defaultOptions);

    case '400':
      return toast.error(i18n.t('notifications:BadRequest'), defaultOptions);

    default:
      return toast.warn(i18n.t('notifications:SomethingWrong'), defaultOptions);
  }
};

export const notifyMyRequests = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error(i18n.t('notifications:NoConnection'), defaultOptions);
    case 'NoApprovedCorrectytion':
      return toast.warn(i18n.t('notifications:NoApprovedCorrectytion'), defaultOptions);
    case '400':
      return toast.error(i18n.t('notifications:BadRequest'), defaultOptions);
    case 'Edited':
      return toast.success(i18n.t('notifications:Edited'), defaultOptions);
    case 'NotEdited':
      return toast.error(i18n.t('notifications:NotEdited'), defaultOptions);
    default:
      return toast.warn(i18n.t('notifications:SomethingWrong'), defaultOptions);
  }
};

export const notifyNewRequest = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error(i18n.t('notifications:NoConnection'), defaultOptions);
    case '400':
      return toast.error(i18n.t('notifications:BadRequest'), defaultOptions);
    case 'Empty managers':
      return toast.error(i18n.t('notifications:EmptyManagers'), defaultOptions);
    case 'Empty dates':
      return toast.error(i18n.t('notifications:EmptyDates'), defaultOptions);
    case 'Empty comment':
      return toast.error(i18n.t('notifications:NoComment'), defaultOptions);
    case 'New request success':
      return toast.success(i18n.t('notifications:NewRequest'), defaultOptions);

    case 'New request failed':
      return toast.error(i18n.t('notifications:NewRequestFail'), defaultOptions);

    default:
      return toast.warn(i18n.t('notifications:SomethingWrong'), defaultOptions);
  }
};

export const notifyOtherRequests = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error(i18n.t('notifications:NoConnection'), defaultOptions);

    case '400':
      return toast.error(i18n.t('notifications:BadRequest'), defaultOptions);

    default:
      return toast.warn(i18n.t('notifications:SomethingWrong'), defaultOptions);
  }
};

export const notifyReviewActions = (msg) => {
  switch (msg) {
    case 'Network Error':
      return toast.error(i18n.t('notifications:NoConnection'), defaultOptions);
    case '400':
      return toast.error(i18n.t('notifications:BadRequest'), defaultOptions);
    case 'Approve success':
      return toast.success(i18n.t('notifications:ApproveRequest'), defaultOptions);
    case 'Approve failed':
      return toast.error(i18n.t('notifications:ApproveFail'), defaultOptions);
    case 'Rejection success':
      return toast.success(i18n.t('notifications:RejectRequest'), defaultOptions);
    case 'Rejection failed':
      return toast.error(i18n.t('notifications:RejectFail'), defaultOptions);
    case 'No comment':
      return toast.error(i18n.t('notifications:NoComment'), defaultOptions);
    default:
      return toast.warn(i18n.t('notifications:SomethingWrong'), defaultOptions);
  }
};
