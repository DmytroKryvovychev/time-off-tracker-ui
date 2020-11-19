import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import ReviewsTable from './ReviewsTable';
import ReviewsFilter from './ReviewsFilter';
import { loadData } from './LoadReviewsData';
import { getMyReviewsByFilter } from '../Axios';
import { types } from '../../constants';
import { Users } from '../../Context';
import { notifyOtherRequests } from '../../notifications';

function NewRequests() {
  const [data, setData] = useState(null);
  const [isSendingRequest, setRequestSending] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation(['reviews', 'notifications']);
  const [users] = React.useContext(Users);

  const handleFilter = (fromDate, toDate, name, typeId) => {
    setRequestSending(true);
    setLoading(true);
    getMyReviewsByFilter(fromDate, toDate, name, typeId)
      .then(({ data }) => {
        const isNew = data.filter((item) => item.isApproved === null);
        setData(isNew);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          notifyOtherRequests('Network Error');
        } else if (err.response.status === 400) {
          notifyOtherRequests('400');
        } else {
          notifyOtherRequests('');
        }
      });
    setRequestSending(false);
  };

  const getData = (data) => {
    setData(data);
  };

  const uploaded = () => {
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadData(getData, uploaded, null);
  }, []);

  return (
    <div>
      <ReviewsFilter
        types={types}
        isSendingRequest={isSendingRequest}
        handleFilter={handleFilter}
      />

      <div>
        {isLoading ? (
          <CircularProgress />
        ) : users && data.length > 0 ? (
          <ReviewsTable data={data} users={users} />
        ) : (
          <h3>{t('NoData')}</h3>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default NewRequests;
