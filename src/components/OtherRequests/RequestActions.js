import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import LeaveComment from '../Leaves/LeaveComment';
import { actionReview } from '../Axios';
import { notifyReviewActions } from '../../notifications';

//Custom hook to get params from query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function RequestActions() {
  let query = useQuery();
  const [isSendingRequest, setSending] = useState(true);
  const [comment, setComment] = useState('');
  const [result, setResult] = useState('');
  const [isRejected, setRejected] = useState('');
  const { t } = useTranslation('reviews');

  useEffect(() => {
    if (query.get('action') === 'approve') {
      handleApprove(query.get('review'), true);
    } else {
      setSending(false);
    }
  }, [query]);

  const handleApprove = (reviewId, action) => {
    if (!action && comment === '') {
      notifyReviewActions('No comment');
      return;
    }
    actionReview(reviewId, action, comment)
      .then(() => {
        action ? setResult('ApprovedRequest') : setRejected('RejectedRequest');
        action ? notifyReviewActions('Approve success') : notifyReviewActions('Rejection success');
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          notifyReviewActions('Network Error');
        } else if (err.response.status === 400) {
          notifyReviewActions('400');
        } else {
          action ? notifyReviewActions('Approve failed') : notifyReviewActions('Rejection failed');
        }
        action ? setResult('NotApprovedRequest') : setRejected('NotRejectedRequest');
      });

    setSending(false);
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
  {
    /* <p>{t('ApprovedRequest')}</p> */
  }
  return (
    <div>
      {query.get('action') === 'approve' ? (
        isSendingRequest ? (
          <CircularProgress />
        ) : (
          <p>{t(result)}</p>
        )
      ) : isRejected.length === 0 ? (
        <div style={{ width: 500 }}>{renderRejectFields()}</div>
      ) : (
        <p>{t(isRejected)}</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default RequestActions;
