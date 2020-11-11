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
import { getRequestById } from '../components/Axios';
import { types, states } from '../constants';
import { Users } from '../Context';

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

  return (
    <div style={{ padding: 5 }}>
      {request ? (
        <div style={{ width: '500px' }}>
          <h2 style={{ marginBottom: '10px' }}>
            {types[request.typeId].title} (state: {states[request.stateId]})
          </h2>
          {renderLeaveBody[request.typeId - 1].comp}
          <div style={{ marginTop: 20 }}>
            {request.stateId !== 4 && (
              <Button
                className="new-request__ok-btn"
                variant="contained"
                disabled={isSendingRequest}
                onClick={() => {
                  setEditable(false);
                }}>
                Edit
              </Button>
            )}
            <Button
              className="new-request__cancel-btn"
              variant="contained"
              disabled={isSendingRequest}
              onClick={() => {}}
              autoFocus>
              Duplicate
            </Button>
            <Button
              className="new-request__cancel-btn"
              variant="contained"
              disabled={isSendingRequest}
              onClick={() => {}}
              autoFocus>
              Decline
            </Button>
            <Button
              className="new-request__cancel-btn"
              variant="contained"
              disabled={isSendingRequest}
              onClick={() => {
                history.goBack();
              }}
              autoFocus>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <p>No Request by id: {id}</p>
      )}
    </div>
  );
}

export default PersonalRequest;
