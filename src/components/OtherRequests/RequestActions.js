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
  const { t } = useTranslation(['reviews', 'notifications']);

  useEffect(() => {
    if (query.get('action') === 'approve') {
      handleApprove(query.get('review'), true);
    } else {
      setSending(false);
    }
  }, []);

  const handleApprove = (reviewId, action) => {
    if (!action && comment === '') {
      notifyReviewActions('No comment');
      setSending(false);
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
        } else if (err.response && err.response.status === 400) {
          notifyReviewActions('400');
        } else if (err.response && err.response.status === 409) {
          switch (err.response.data) {
            case 'The request is not actual!':
              setResult('NotActualRequest');
              action
                ? notifyReviewActions('Approve failed')
                : notifyReviewActions('Rejection failed');
              break;
            case 'The request has already been <approved/rejected>!':
              setResult('AlreadyDone');
              action
                ? notifyReviewActions('Approve failed')
                : notifyReviewActions('Rejection failed');
              break;
            case 'No previous review!':
              setResult('NoPrevReview!');
              action
                ? notifyReviewActions('Approve failed')
                : notifyReviewActions('Rejection failed');
              break;
            default:
              setResult('SomethingWrong');
              action
                ? notifyReviewActions('Approve failed')
                : notifyReviewActions('Rejection failed');
              break;
          }
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
          <p>{t(result)}</p>
        )
      ) : isRejected.length === 0 ? (
        <div className="reject__content">{renderRejectFields()}</div>
      ) : (
        <p>{t(isRejected)}</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default RequestActions;
