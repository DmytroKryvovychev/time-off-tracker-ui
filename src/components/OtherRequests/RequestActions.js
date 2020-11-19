import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import LeaveComment from '../Leaves/LeaveComment';
import { actionReview } from '../Axios';

//Custom hook to get params from query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function RequestActions() {
  let query = useQuery();
  const [isSendingRequest, setSending] = useState(true);
  const [comment, setComment] = useState('');
  const { t } = useTranslation('reviews');

  useEffect(() => {
    if (query.get('action') === 'approve') {
      actionReview(query.get('review'), true)
        .then(() => setSending(false))
        .catch((err) => {
          console.log(err);
          setSending(false);
        });
      console.log(query.get('review'));
    } else {
      setSending(false);
    }
  }, []);

  const handleApprove = (reviewId, action) => {
    if (comment === '') return;
    actionReview(reviewId, action, comment)
      .then(() => setSending(false))
      .catch((err) => {
        console.log(err);
        setSending(false);
      });
  };

  const changeComment = (e) => {
    setComment(e.target.value);
  };

  const renderRejectFields = () => {
    return (
      <>
        <h3>{t('RejectReason')}</h3>
        <LeaveComment disabled={isSendingRequest} comment={comment} changeComment={changeComment} />
        <Button
          disabled={isSendingRequest}
          className="reviews-table__cancel-btn"
          variant="contained"
          style={{ marginRight: 10 }}
          onClick={() => {
            setSending(true);
            handleApprove(query.get('review'), false);
          }}>
          {t('Send')}
        </Button>
      </>
    );
  };

  return (
    <div>
      {query.get('action') === 'approve' ? (
        isSendingRequest ? (
          <CircularProgress />
        ) : (
          <p>{t('ApprovedRequest')}</p>
        )
      ) : (
        <div style={{ width: 500 }}>{renderRejectFields()}</div>
      )}
    </div>
  );
}

export default RequestActions;
