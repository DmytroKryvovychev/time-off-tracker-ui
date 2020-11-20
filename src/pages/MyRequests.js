import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import RequestTable from '../components/RequestTable';
import RequestFilter from '../components/RequestFilter';
import NewRequest from './NewRequest';
import { getMyRequests, getMyRequestsByFilter, getStatistics } from '../components/Axios';
import { Users, Context } from '../Context';
import { types } from '../constants';
import { notifyMyRequests } from '../notifications';

function MyRequests() {
  const [data, setData] = useState(null);
  const [isNewRequestOpen, setNewRequestState] = useState(false);
  const { t } = useTranslation(['requests', 'translation', 'notifications']);
  const [users, setUsers] = useContext(Users);
  const [statistics, setStatistics] = useState(null);
  const [context, setContext] = useContext(Context);

  const handleFilter = (fromDate, toDate, stateId, typeId) => {
    getMyRequestsByFilter(fromDate, toDate, stateId, typeId).then(({ data }) => {
      setData(data);
    });
  };

  useEffect(() => {
    async function getRequests() {
      await getMyRequests()
        .then(({ data }) => {
          setData(data);
        })
        .catch((err) => {
          if (err.message === 'Network Error') {
            notifyMyRequests('Network Error');
          } else if (err.response.status === 400) {
            notifyMyRequests('400');
          } else if (err.response.status === 401) {
            localStorage.clear();
            setContext({ userId: null, user: null, role: null, token: null });
          } else {
            notifyMyRequests('');
          }
        });
    }

    async function getStat() {
      await getStatistics()
        .then(({ data }) => {
          setStatistics(data);
        })
        .catch((err) => {
          if (err.message === 'Network Error') {
            notifyMyRequests('Network Error');
          } else if (err.response.status === 400) {
            notifyMyRequests('400');
          } else if (err.response.status === 401) {
            localStorage.clear();
            setContext({ userId: null, user: null, role: null, token: null });
          } else {
            notifyMyRequests('');
          }
        });
    }

    getRequests();
    getStat();
  }, []);

  function chunkArray(myArray, chunk_size) {
    let tempArray = [];

    for (let index = 1; index < myArray.length; index += chunk_size) {
      tempArray.push(myArray.slice(index, index + chunk_size));
    }

    return tempArray;
  }

  return (
    <div>
      <h2>{t('Statistics', { year: new Date().getFullYear() })}</h2>
      <div className="statistics">
        {statistics &&
          chunkArray(types, 3).map((arr, idx) => {
            return (
              <div key={`idx-${idx}`} className="statistics__text">
                {arr.map((item) => {
                  const findItem = statistics.find((stat) => stat.typeId === item.id);
                  return (
                    <p key={`title-${item.title}`}>
                      {t(`translation:${item.title}`)}:{' '}
                      {t('UsedDays', { days: findItem ? findItem.days : 0 })}
                    </p>
                  );
                })}
              </div>
            );
          })}

        <Button
          variant="contained"
          color="secondary"
          style={{ height: '40px' }}
          onClick={() => {
            setNewRequestState(true);
          }}>
          {t('NewRequest')}
        </Button>
      </div>

      <h2>{t('MyRequests')}</h2>

      <RequestFilter handleFilter={handleFilter} />
      {!users || !data ? (
        <CircularProgress />
      ) : users && data && data.length > 0 ? (
        <RequestTable data={data} users={users} />
      ) : (
        <h3>{t('NoRequests')}</h3>
      )}
      <NewRequest
        isOpen={isNewRequestOpen}
        onClose={() => {
          setNewRequestState(false);
        }}
      />
      <ToastContainer />
    </div>
  );
}

export default MyRequests;
