import React from 'react';
import DoneIcon from '@material-ui/icons/Done';

import Signers from './Signers';

function Approvers({
  managers,
  isSendingRequest,
  prManagers,
  changeManagers,
  request,
  isEditable,
}) {
  const isApproved = (manager) => {
    const sign = request.reviews.find(
      (req) => req.reviewer.firstName.concat(' ', req.reviewer.lastName) === manager,
    );
    if (sign !== undefined) {
      return sign.isApproved;
    }
    return null;
  };

  const mapping = React.useCallback(
    (managers) => {
      return (
        <>
          {managers.map((manager, idx) => {
            return (
              <div
                key={`div-icon-${idx}`}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <DoneIcon
                  key={`done-icon-${idx}`}
                  className={`done-icon${
                    request && isApproved(manager) !== null
                      ? isApproved(manager)
                        ? ' accepted'
                        : ' rejected'
                      : ''
                  }`}
                  style={{
                    marginTop: '5px',
                  }}
                />
                <Signers
                  key={`sign-idx-${idx}`}
                  idx={idx}
                  options={prManagers}
                  managers={managers}
                  onChange={changeManagers}
                  isDisabled={isSendingRequest}
                  isApproved={request && request.stateId !== 1 && isApproved(manager)}
                  isEditable={isEditable}
                />
              </div>
            );
          })}
        </>
      );
    },
    [isSendingRequest],
  );

  return (
    <div>
      <h3>Approvers</h3>
      <ol className="approvers__list">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <DoneIcon
            className={
              'done-icon' +
              (request && request.reviews[0].isApproved === true ? ' accepted' : '') +
              (request && request.reviews[0].isApproved === false ? ' rejected' : '')
            }
          />
          <li>Accounting</li>
        </div>
        {managers && mapping(managers)}
      </ol>
    </div>
  );
}

export default Approvers;
