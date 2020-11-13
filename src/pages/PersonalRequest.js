import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import moment from 'moment';

import {
  Administrative,
  AdministrativeFm,
  Paid,
  SickNoDoc,
  SickWithDoc,
  Social,
  Study,
} from '../components/Leaves/index';
import { getRequestById, changeRequest } from '../components/Axios';
import { types, states } from '../constants';
import { Users } from '../Context';
import ConfirmationDialog from '../components/Leaves/ConfirmationDialog';
import NewRequest from './NewRequest';
import { useTranslation } from 'react-i18next';

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
  const [isNewRequestOpened, openNewRequest] = useState(false);
  const { t } = useTranslation(['requests', 'translation']);

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

  useEffect(() => {
    if (users) {
      getRequestById(id)
        .then(({ data }) => {
          data.reviews.map(
            (item) => (item.reviewer = users.find((user) => user.id === item.reviewerId)),
          );
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
        })
        .catch((err) => console.log(err));
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

  const handleChangeRequest = () => {
    setRequestSending(true);
    const reviewerIds = pmanager.map((item) => {
      return users
        .filter((us) => us.role === 'Manager')
        .find((dat) => dat.firstName.concat(' ', dat.lastName) === item).id;
    });

    changeRequest(id, {
      id: id,
      startDate: moment(fromDate._d).format('YYYY-MM-DD').toString(),
      endDate: moment(toDate._d).format('YYYY-MM-DD').toString(),
      reviewsIds: [1, ...reviewerIds],
      comment: comment,
      durationId: duration,
    }).catch((err) => console.log(err));

    setRequestSending(false);
  };

  return (
    <div style={{ padding: 5 }}>
      {request ? (
        <dispatchEvent>
          <h2 style={{ marginBottom: '10px' }}>
            {t(`translation:${types[request.typeId].title}`)}
            <p style={{ fontSize: '20px' }}>
              ({t('State')}: {t(`translation:${states[request.stateId]}`)})
            </p>
          </h2>
          <div style={{ width: '450px' }}>{renderLeaveBody[request.typeId - 1].comp}</div>

          <div style={{ marginTop: 20 }}>
            {request.stateId !== states.indexOf('Rejected') && isEditable ? (
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
                    handleChangeRequest();
                    setEditable(true);
                  }}>
                  {t('Save Changes')}
                </Button>
                <Button
                  className="personal-request__ce-btn"
                  variant="contained"
                  disabled={isSendingRequest}
                  onClick={() => {
                    cancelEditing();
                    setEditable(true);
                  }}>
                  {t('Cancel Editing')}
                </Button>
              </>
            )}
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
                <Button
                  className="personal-request__decline-btn"
                  variant="contained"
                  disabled={isSendingRequest}
                  onClick={() => {}} //Отмена пользователем
                  autoFocus>
                  {t('Decline')}
                </Button>
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
        </dispatchEvent>
      ) : (
        <p>{t('No Request by id', { id: id })}</p>
      )}
      <ConfirmationDialog isOpen={isDialogOpen} onClose={onDialogClose} onOk={onDialogConfirm} />
    </div>
  );
}

export default PersonalRequest;
