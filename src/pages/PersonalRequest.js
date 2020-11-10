import React, { useState, useEffect } from 'react';
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

let prManagers = [];

function PersonalRequest() {
  const { id } = useParams();
  let history = useHistory();
  const [request, setRequest] = useState(null);
  const [isSendingRequest, setRequestSending] = useState(false);
  const [comment, setComment] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [pmanager, setPManager] = useState(['']);
  const [duration, setDuration] = useState(2);
  const [isEditable, setEditable] = useState(false);

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
    getRequestById(id)
      .then(({ data }) => {
        console.log(data);
        setFromDate(moment(data.startDate));
        setToDate(moment(data.endDate));
        setComment(data.comment);
        setRequest(data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div style={{ padding: 5 }}>
      {request ? (
        <div style={{ width: '500px' }}>
          <h2 style={{ marginBottom: '10px' }}>
            {types[request.typeId].title} (state: {states[request.stateId]})
          </h2>
          {renderLeaveBody[request.typeId - 1].comp}
          <Button
            className="new-request__ok-btn"
            variant="contained"
            disabled={isSendingRequest}
            onClick={() => {
              setEditable(true);
            }}>
            Edit
          </Button>
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
            disabled={isEditable}
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
      ) : (
        <p>No Request by id: {id}</p>
      )}
    </div>
  );
}

export default PersonalRequest;
