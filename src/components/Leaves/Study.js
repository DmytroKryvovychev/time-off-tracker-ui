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
}) {
  React.useEffect(() => {
    console.log('here');
  }, []);

  return (
    <div>
      <VacationPeriod
        fromDate={fromDate}
        changeFromDate={changeFromDate}
        toDate={toDate}
        changeToDate={changeToDate}
        isSendingRequest={isEditable !== undefined ? isEditable : isSendingRequest}
      />

      <LeaveComment
        disabled={isEditable !== undefined ? isEditable : isSendingRequest}
        comment={comment}
        changeComment={changeComment}
      />

      <Approvers
        managers={managers}
        isSendingRequest={isSendingRequest}
        prManagers={prManagers}
        changeManagers={changeManagers}
      />
    </div>
  );
}

export default Study;
