import React from 'react';

import Approvers from './Approvers';
import LeaveComment from './LeaveComment';
import VacationPeriod from './VacationPeriod';

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
          (request && (request.stateId === 2 ? true : isEditable)) || isSendingRequest
        }
      />

      <LeaveComment
        disabled={(request && (request.stateId !== 1 ? true : isEditable)) || isSendingRequest}
        comment={comment}
        changeComment={changeComment}
      />

      <Approvers />
    </div>
  );
}

export default Social;
