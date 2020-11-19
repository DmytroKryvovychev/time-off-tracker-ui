import React from 'react';

import Approvers from './Approvers';
import LeaveComment from './LeaveComment';
import VacationPeriod from './VacationPeriod';

import { states } from '../../constants';

function Social({
  isSendingRequest,
  comment,
  changeComment,
  fromDate,
  changeFromDate,
  toDate,
  changeToDate,
  request,
  isEditable,
}) {
  return (
    <div>
      <VacationPeriod
        fromDate={fromDate}
        changeFromDate={changeFromDate}
        toDate={toDate}
        changeToDate={changeToDate}
        isSendingRequest={
          (request && (request.stateId === states.indexOf('In progress') ? true : isEditable)) ||
          isSendingRequest
        }
      />

      <LeaveComment
        disabled={
          (request && (request.stateId === states.indexOf('In progress') ? true : isEditable)) ||
          isSendingRequest
        }
        comment={comment}
        changeComment={changeComment}
      />

      <Approvers />
    </div>
  );
}

export default Social;
