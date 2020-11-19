import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import { useTranslation } from 'react-i18next';

import Signers from './Signers';
import { states } from '../../constants';

function Approvers({
  managers,
  isSendingRequest,
  prManagers,
  changeManagers,
  request,
  isEditable,
}) {
  const { t } = useTranslation(['leaves', 'roles']);

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
                />
                <Signers
                  key={`sign-idx-${idx}`}
                  idx={idx}
                  options={prManagers}
                  managers={managers}
                  onChange={changeManagers}
                  isDisabled={isSendingRequest}
                  isApproved={
                    request &&
                    request.stateId === states.indexOf('In progress') &&
                    isApproved(manager)
                  }
                  isEditable={isEditable}
                />
              </div>
            );
          })}
        </>
      );
    },
    [isSendingRequest, isEditable],
  );

  return (
    <div>
      <h3>{t('Approvers')}</h3>
      <ol className="approvers__list">
        <div className="approvers__content">
          <DoneIcon
            className={
              'done-icon' +
              (request && request.reviews[0].isApproved === true ? ' accepted' : '') +
              (request && request.reviews[0].isApproved === false ? ' rejected' : '')
            }
          />
          <li>{t('roles:Accounting')}</li>
        </div>
        {managers && mapping(managers)}
      </ol>
    </div>
  );
}

export default Approvers;
