import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
  Input,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
import axios from 'axios';

import {
  Administrative,
  AdministartiveFm,
  Paid,
  SickNoDoc,
  SickWithDoc,
  Social,
  Study,
} from '../components/Leaves/index';

const leaves = [
  'Administrative force majeure leave',
  'Administrative leave',
  'Social leave',
  'Sick leave (no documents)',
  'Sick leave (with documents)',
  'Study leave',
  'Paid leave',
];

const prRoles = ['BA lead', 'QA', 'Junior'];
const prParticipation = ['Full', 'Fullest', 'Distance'];
const prManagers = [
  'Anney Kirillova',
  'Bill Ivanov',
  'Reygar Smith',
  'Kirill Retushev',
  'Yevheniy Enderov',
];

function NewRequest({ isOpen, onClose }) {
  const [leaveType, setLeaveType] = useState(6);
  const [isSendingRequest, setRequestSending] = useState(false);

  const handleSendRequest = async () => {
    setRequestSending(true);
    await axios
      .post('https://url')
      .then((data) => {})
      .catch((err) => {});
    setRequestSending(false);
  };

  useEffect(() => {
    async function getAllData() {
      //await axios.get(url).then({data}=>) //axios request for all managers
      //axios request for all roles
      //axios request for all parts
      //axios request for all pm
    }
    getAllData();
  }, []);

  const renderLeaveBody = (type) => {
    switch (type) {
      case 0:
        return (
          <Administrative
            prRoles={prRoles}
            prParticipation={prParticipation}
            prManagers={prManagers}
            isSendingRequest={isSendingRequest}
          />
        );
      case 6:
        return (
          <Paid
            prRoles={prRoles}
            prParticipation={prParticipation}
            prManagers={prManagers}
            isSendingRequest={isSendingRequest}
          />
        );
    }
  };

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={isOpen}
        onClose={onClose}
        aria-labelledby="new-request-title"
        aria-describedby="new-request-description">
        <DialogTitle id="new-request-title">New Request</DialogTitle>
        <DialogContent className="leave">
          <FormControl
            disabled={isSendingRequest}
            style={{ marginRight: 20, marginBottom: 20, width: '100%' }}>
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={leaveType}
              onChange={(e) => {
                setLeaveType(e.target.value);
              }}>
              {leaves.map((type, idx) => (
                <MenuItem value={idx}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {renderLeaveBody(leaveType)}
        </DialogContent>
        <DialogActions>
          <Button
            className="new-request__ok-btn"
            variant="contained"
            disabled={isSendingRequest}
            onClick={handleSendRequest}>
            Send Request
          </Button>
          <Button
            className="new-request__cancel-btn"
            variant="contained"
            disabled={isSendingRequest}
            onClick={onClose}
            autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewRequest;
