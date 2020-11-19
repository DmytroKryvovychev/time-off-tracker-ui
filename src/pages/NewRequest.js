import React, { useState, useEffect, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import { Context } from '../Context';
import { postNewRequest, getAllManagers } from '../components/Axios';

import {
  Administrative,
  AdministrativeFm,
  Paid,
  SickNoDoc,
  SickWithDoc,
  Social,
  Study,
} from '../components/Leaves/index';
import { notifyNewRequest } from '../notifications';

//ForceMajeureAdministrativeLeave = 1,
// AdministrativeUnpaidLeave = 2,
// SocialLeave = 3,
// SickLeaveWithoutDocuments = 4,
// SickLeaveWithDocuments = 5,
// StudyLeave = 6,
// PaidLeave = 7

let prManagers = [];

const accountantId = 1;

function NewRequest({ isOpen, onClose, calendar, request }) {
  const [context, setContext] = useContext(Context);
  const [leaveType, setLeaveType] = useState(6);
  const [isSendingRequest, setRequestSending] = useState(false);
  const [comment, setComment] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [pmanager, setPManager] = useState(['']);
  const [duration, setDuration] = useState(2);
  const [data, setData] = useState(null);
  const { t } = useTranslation(['translation', 'requests', 'notifications']);

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

  const handleSendRequest = async () => {
    setRequestSending(true);

    const reviewerIds =
      pmanager.length > 0 && pmanager[0] !== ''
        ? pmanager.map((item) => {
            return data.find((dat) => dat.firstName.concat(' ', dat.lastName) === item).id;
          })
        : null;

    await postNewRequest({
      leaveType,
      fromDate: moment(fromDate._d).format('YYYY-MM-DD').toString(),
      toDate: moment(toDate._d).format('YYYY-MM-DD').toString(),
      pmanager: reviewerIds !== null ? [1, ...reviewerIds] : [1],
      comment,
      duration,
      userId: context.userId,
    })
      .then(({ data }) => {
        notifyNewRequest('New request success');
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          notifyNewRequest('Network Error');
        } else if (err.response.status === 400) {
          notifyNewRequest('400');
        } else {
          notifyNewRequest('New request failed');
        }
      });

    setRequestSending(false);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  useEffect(() => {
    async function getAllData() {
      await getAllManagers().then(({ data }) => {
        setData(data);
        prManagers = data.map((item) => {
          return item.firstName.concat(' ', item.lastName);
        });
      });
    }
    getAllData();
  }, []);

  useEffect(() => {
    if (request) {
      const managers = request.reviews
        .filter((item) => item.reviewerId !== accountantId)
        .map((rev) => rev.reviewer.firstName.concat(' ', rev.reviewer.lastName));
      setPManager(managers);
      setFromDate(moment(request.startDate));
      setToDate(moment(request.endDate));
      setDuration(request.durationId);
      setComment(request.comment);
      setLeaveType(request.typeId);
    }
  }, []);

  useEffect(() => {
    if (calendar) {
      setFromDate(calendar[0]);
      setToDate(calendar[1]);
    }
  }, [calendar]);

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
  };

  const renderLeaveBody = [
    {
      id: 1,
      title: 'AdministrativeForceMajeureLeave',
      comp: <AdministrativeFm {...typeProps} />,
    },
    { id: 2, title: 'AdministrativeLeave', comp: <Administrative {...typeProps} /> },
    { id: 3, title: 'SocialLeave', comp: <Social {...typeProps} /> },
    { id: 4, title: 'SickLeaveNoDocuments', comp: <SickNoDoc {...typeProps} /> },
    { id: 5, title: 'SickLeaveWithDocuments', comp: <SickWithDoc {...typeProps} /> },
    { id: 6, title: 'StudyLeave', comp: <Study {...typeProps} /> },
    { id: 7, title: 'PaidLeave', comp: <Paid {...typeProps} /> },
  ];

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={isOpen}
        onClose={onClose}
        aria-labelledby="new-request-title"
        aria-describedby="new-request-description">
        <DialogTitle id="new-request-title">{t('requests:NewRequest')}</DialogTitle>
        <DialogContent className="leave">
          <FormControl
            disabled={isSendingRequest}
            style={{ marginRight: 20, marginBottom: 20, width: '100%' }}>
            <InputLabel>{t('requests:LeaveType')}</InputLabel>
            <Select
              value={leaveType}
              onChange={(e) => {
                setLeaveType(e.target.value);
                setPManager(['']);
              }}>
              {renderLeaveBody.map((type, idx) => (
                <MenuItem key={`${type.title}-${idx}`} value={type.id}>
                  {t(type.title)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {renderLeaveBody[leaveType - 1].comp}
        </DialogContent>
        <DialogActions>
          <Button
            className="new-request__ok-btn"
            variant="contained"
            disabled={isSendingRequest}
            onClick={handleSendRequest}>
            {t('requests:SendRequest')}
          </Button>
          <Button
            className="new-request__cancel-btn"
            variant="contained"
            disabled={isSendingRequest}
            onClick={onClose}
            autoFocus>
            {t('requests:Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
}

export default React.memo(NewRequest);
