import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';

import ReviewsTable from './ReviewsTable';
import ReviewsFilter from './ReviewsFilter';
import { loadData } from './LoadReviewsData';
import { getMyReviewsByFilter } from '../Axios';
import { types } from '../../constants';
import { Users } from '../../Context';

function NewRequests() {
  const [data, setData] = useState(null);
  const [isSendingRequest, setRequestSending] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation('reviews');
  const [users, setUsers] = React.useContext(Users);

  const handleSendRequest = async () => {
    setRequestSending(true);
  };

  const handleFilter = (fromDate, toDate, name, typeId) => {
    setLoading(true);
    getMyReviewsByFilter(fromDate, toDate, name, typeId).then(({ data }) => {
      const isNew = data.filter((item) => item.isApproved === null);
      setData(isNew);
      setLoading(false);
    });
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
    </div>
  );
}

export default NewRequests;
