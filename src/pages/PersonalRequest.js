import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer } from 'react-toastify';

import {
  Administrative,
  AdministrativeFm,
  Paid,
  SickNoDoc,
  SickWithDoc,
  Social,
  Study,
} from '../components/Leaves/index';
import { getRequestById, changeRequest, declineRequest } from '../components/Axios';
import { types, states } from '../constants';
import { notifyNewRequest, notifyMyRequests } from '../notifications';
import { Users } from '../Context';
import ConfirmationDialog from '../components/Leaves/ConfirmationDialog';
import NewRequest from './NewRequest';
import { useTranslation } from 'react-i18next';
import DateIntersectionDialog from '../components/Leaves/DateIntersectionDialog';

let prManagers = [];

function PersonalRequest() {
  const { id } = useParams();
  let history = useHistory();
  const [users, setUsers] = useContext(Users);
  const [request, setRequest] = useState(null);
  const [isSendingRequest, setRequestSending] = useState(false);
  const [comment, setComment] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [pmanager, setPManager] = useState(['']);
  const [duration, setDuration] = useState(2);
  const [isEditable, setEditable] = useState(true);
  const [isDialogOpen, openDialog] = useState(false);
  const [isIntersectDialog, openIntersectDialog] = useState(false);
  const [isNewRequestOpened, openNewRequest] = useState(false);
  const [result, setResult] = useState('');
  const { t } = useTranslation(['requests', 'translation', 'notifications']);

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleFromDate = (date) => {
    setFromDate(date);
  };

  const handleToDate = (date) => {
    setToDate(date);
  };

  const handleManagers = (array) => {
    setPManager(array);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const typeProps = {
    prManagers: prManagers,
    isSendingRequest: isSendingRequest,
    comment: comment,
    changeComment: handleComment,
    fromDate: fromDate,
    changeFromDate: handleFromDate,
    toDate: toDate,
    changeToDate: handleToDate,
    managers: pmanager,
    changeManagers: handleManagers,
    duration: duration,
    changeDuration: handleDuration,
    isEditable: isEditable,
    request: request,
  };

  const renderLeaveBody = [
    {
      id: 1,
      title: 'Administrative force majeure leave',
      comp: <AdministrativeFm {...typeProps} />,
    },
    { id: 2, title: 'Administrative leave', comp: <Administrative {...typeProps} /> },
    { id: 3, title: 'Social leave', comp: <Social {...typeProps} /> },
    { id: 4, title: 'Sick leave (no documents)', comp: <SickNoDoc {...typeProps} /> },
    { id: 5, title: 'Sick leave (with documents)', comp: <SickWithDoc {...typeProps} /> },
    { id: 6, title: 'Study leave', comp: <Study {...typeProps} /> },
    { id: 7, title: 'Paid leave', comp: <Paid {...typeProps} /> },
  ];

  const cancelEditing = () => {
    const managers = request.reviews
      .filter((item) => item.reviewerId !== 1)
      .map((rev) => rev.reviewer.firstName.concat(' ', rev.reviewer.lastName));
    setPManager(managers);
    setFromDate(moment(request.startDate));
    setToDate(moment(request.endDate));
    setDuration(request.durationId);
    setComment(request.comment);
  };

  const dataSet = (data) => {
    data.reviews.map((item) => (item.reviewer = users.find((user) => user.id === item.reviewerId)));
    data.user = users.find((user) => user.id === data.userId);
    const managers = data.reviews
      .filter((item) => item.reviewerId !== 1)
      .map((rev) => rev.reviewer.firstName.concat(' ', rev.reviewer.lastName));
    setPManager(managers);
    setFromDate(moment(data.startDate));
    setToDate(moment(data.endDate));
    setDuration(data.durationId);
    setComment(data.comment);
    setRequest(data);
  };

  useEffect(() => {
    if (users) {
      getRequestById(id)
        .then(({ data }) => {
          dataSet(data);
        })
        .catch((err) => {
          if (err.message === 'Network Error') {
            notifyMyRequests('Network Error');
          } else if (err.response && err.response.status === 400) {
            notifyMyRequests('400');
          } else {
            notifyMyRequests('');
          }
          setResult('NotFound');
          return;
        });
    }

    if (users) {
      prManagers = users
        .filter((us) => us.role === 'Manager')
        .map((item) => {
          return item.firstName.concat(' ', item.lastName);
        });
    }
  }, [id, users]);

  const onDialogClose = () => {
    openDialog(false);
  };

  const onIntersectDialogClose = () => {
    openIntersectDialog(false);
  };

  const onDialogConfirm = () => {
    setEditable(false);

    const modifiedRequest = request;
    modifiedRequest.reviews = request.reviews.map((item) => {
      item.isApproved = null;
      return item;
    });
    setRequest(modifiedRequest);
    openDialog(false);
  };

  const handleChangeRequest = (flagDateIntersection) => {
    setRequestSending(true);

    if (!fromDate || !toDate) {
      notifyNewRequest('Empty dates');
      setRequestSending(false);
      return;
    }

    if ([2, 6, 7].includes(request.typeId) && comment.replaceAll(' ', '').length === 0) {
      notifyNewRequest('Empty comment');
      setRequestSending(false);
      return;
    }

    if ([2, 6, 7].includes(request.typeId) && pmanager.includes('')) {
      notifyNewRequest('Empty managers');
      setRequestSending(false);
      return;
    }

    const reviewerIds =
      pmanager.length > 0
        ? pmanager.map((item) => {
            return users
              .filter((us) => us.role === 'Manager')
              .find((dat) => dat.firstName.concat(' ', dat.lastName) === item).id;
          })
        : null;

    changeRequest(id, {
      id: id,
      typeId: request.typeId,
      startDate: moment(fromDate._d).format('YYYY-MM-DD').toString(),
      endDate: moment(toDate._d).format('YYYY-MM-DD').toString(),
      reviewsIds: reviewerIds !== null ? [1, ...reviewerIds] : [1],
      comment: comment,
      durationId: duration,
      isDateIntersectionAllowed: flagDateIntersection,
    })
      .then(() => notifyMyRequests('Edited'))
      .catch((err) => {
        if (err.message === 'Network Error') {
          notifyMyRequests('Network Error');
          dataSet(request);
        } else if (err.response && err.response.status === 400) {
          notifyMyRequests('400');
          dataSet(request);
        } else if (err.response && err.response.status === 409) {
          openIntersectDialog(true);
        } else {
          notifyMyRequests('NotEdited');
          dataSet(request);
        }
      });
    openIntersectDialog(false);
    setRequestSending(false);
  };

  const handleDeleteRequest = () => {
    setRequestSending(true);

    declineRequest(id)
      .then(() => {
        setEditable(true);
        history.push('/my_requests');
      })
      .catch((err) => {
        console.log(err);
        if (err.message === 'Network Error') {
          notifyMyRequests('Network Error');
        } else if (err.response && err.response.status === 400) {
          notifyMyRequests('400');
        } else {
          notifyMyRequests('');
        }
      });

    setRequestSending(false);
  };

  return (
    <div className="personal__content" style={{ padding: 5 }}>
      {result.length === 0 ? (
        request ? (
          <div>
            <h2 className="personal__type">
              {t(`translation:${types[request.typeId].title}`)}
              <p className="personal__state">
                ({t('State')}: {t(`translation:${states[request.stateId]}`)})
              </p>
            </h2>
            <div className="personal__request">{renderLeaveBody[request.typeId - 1].comp}</div>

            <div className="personal__btn-group">
              {[states.indexOf('New'), states.indexOf('InProgress')].includes(request.stateId) ||
              (request.stateId === states.indexOf('Approved') &&
                new Date(request.endDate) > new Date()) ? (
                isEditable ? (
                  <Button
                    className="personal-request__edit-btn"
                    variant="contained"
                    disabled={isSendingRequest}
                    onClick={() => {
                      if (request.stateId === states.indexOf('Approved')) {
                        openDialog(true);
                      } else {
                        setEditable(false);
                      }
                    }}>
                    {t('Edit')}
                  </Button>
                ) : (
                  <>
                    <Button
                      className="personal-request__save-btn"
                      variant="contained"
                      disabled={isSendingRequest}
                      onClick={() => {
                        handleChangeRequest(false);
                        setEditable(true);
                      }}>
                      {t('SaveChanges')}
                    </Button>
                    <Button
                      className="personal-request__ce-btn"
                      variant="contained"
                      disabled={isSendingRequest}
                      onClick={() => {
                        cancelEditing();
                        setEditable(true);
                      }}>
                      {t('CancelEditing')}
                    </Button>
                  </>
                )
              ) : null}
              {isEditable && (
                <>
                  <Button
                    className="personal-request__duplicate-btn"
                    variant="contained"
                    disabled={isSendingRequest}
                    onClick={() => {
                      openNewRequest(true);
                    }}
                    autoFocus>
                    {t('Duplicate')}
                  </Button>
                  {[states.indexOf('New'), states.indexOf('InProgress')].includes(
                    request.stateId,
                  ) ||
                  (request.stateId === states.indexOf('Approved') &&
                    new Date(request.endDate) > new Date()) ? (
                    <Button
                      className="personal-request__decline-btn"
                      variant="contained"
                      disabled={isSendingRequest}
                      onClick={() => {
                        handleDeleteRequest();
                      }}
                      autoFocus>
                      {t('Decline')}
                    </Button>
                  ) : null}
                  <Button
                    className="personal-request__close-btn"
                    variant="contained"
                    disabled={isSendingRequest}
                    onClick={() => {
                      history.goBack();
                    }}
                    autoFocus>
                    {t('Close')}
                  </Button>
                </>
              )}
            </div>
            <NewRequest
              isOpen={isNewRequestOpened}
              onClose={() => {
                openNewRequest(false);
              }}
              request={request}
            />
            <DateIntersectionDialog
              isOpen={isIntersectDialog}
              onClose={onIntersectDialogClose}
              onOk={() => handleChangeRequest(true)}
              onCancel={() => {
                dataSet(request);
                openIntersectDialog(false);
              }}
            />
          </div>
        ) : (
          <CircularProgress />
        )
      ) : (
        <h2>{t(result)}</h2>
      )}
      <ConfirmationDialog isOpen={isDialogOpen} onClose={onDialogClose} onOk={onDialogConfirm} />
      <ToastContainer />
    </div>
  );
}

export default PersonalRequest;
