import { axiosApi } from '../config';

export const newUser = (newUser) => {
  return axiosApi.post('accounts', newUser);
};

export const getUsers = (name, role) => {
  return axiosApi.get(`users?name=${name}&role=${role}`);
};

export const getUserById = (id) => {
  return axiosApi.get('users/' + id);
};

export const deleteUser = (id) => {
  return axiosApi.delete('users/' + id);
};

export const changeUserRole = (changedUser) => {
  return axiosApi.put('users/', changedUser);
};

export const getAllManagers = () => {
  return axiosApi.get('users?role=Manager');
};

export const getMyRequests = () => {
  return axiosApi.get('user/requests');
};

export const getRequestById = (id) => {
  return axiosApi.get('user/requests/' + id);
};

export const getMyRequestsByFilter = (startDate, endDate, stateId, typeId) => {
  return axiosApi.get(
    `user/requests?startDate=${startDate}&endDate=${endDate}&stateId=${stateId}&typeId=${typeId}`,
  );
};

export const changeRequest = (id, payload) => {
  return axiosApi.put(`requests/${id}`, payload);
};

export const getMyReviews = () => {
  return axiosApi.get(`user/reviews`);
};

export const getMyReviewsByFilter = (startDate, endDate, name, typeId) => {
  return axiosApi.get(
    `user/reviews?startDate=${startDate}&endDate=${endDate}&name=${name}&typeId=${typeId}`,
  );
};

export const postNewRequest = (newRequest) => {
  const { leaveType, fromDate, toDate, pmanager, comment, duration, userId } = newRequest;
  return axiosApi.post('requests', {
    typeId: leaveType,
    startDate: fromDate,
    endDate: toDate,
    reviewsIds: pmanager,
    comment: comment,
    durationId: duration,
    userId: userId,
  });
};

export const actionReview = (reviewId, isApproved, comment = '') => {
  const body = isApproved
    ? { isApproved: isApproved }
    : { isApproved: isApproved, comment: comment };
  return axiosApi.put(`user/reviews/${reviewId}`, body);
};
