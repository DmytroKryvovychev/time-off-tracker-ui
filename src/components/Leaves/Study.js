import React from 'react';

import Approvers from './Approvers';
import LeaveComment from './LeaveComment';
import VacationPeriod from './VacationPeriod';

function Study({
  prManagers,
  isSendingRequest,
  comment,
  changeComment,
  fromDate,
  changeFromDate,
  toDate,
  changeToDate,
  managers,
  changeManagers,
  isEditable,
  request,
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
        disabled={(request && (request.stateId === 2 ? true : isEditable)) || isSendingRequest}
        comment={comment}
        changeComment={changeComment}
      />

      <Approvers
        managers={managers}
        isSendingRequest={isEditable || isSendingRequest}
        prManagers={prManagers}
        changeManagers={changeManagers}
        request={request}
        isEditable={isEditable}
      />
    </div>
  );
}

export default Study;
