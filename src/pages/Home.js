import React, { useState, useEffect, useContext } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { getMyRequests, getMyReviews, getUserById } from '../components/Axios';
import { Context, Users } from '../Context';
import { types } from '../constants';
import NewRequest from './NewRequest';
import ReviewsTable from '../components/OtherRequests/ReviewsTable';
import RequestTable from '../components/RequestTable';
import Calendar from '../components/Calendar';

function Home() {
  const [isLoading, setLoading] = useState(true);
  const [isNewRequestOpen, setNewRequestState] = useState(false);
  const [requests, setRequests] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [events, setEvents] = useState(null);
  const { t } = useTranslation('home');

  let history = useHistory();
  const [context, setContext] = useContext(Context);
  const [users, setUsers] = useContext(Users);

  const funct = (start, end) => {
    const startObj = moment(new Date(start));
    const endObj = moment(new Date(end));

    setCalendar([startObj, endObj]);
    setNewRequestState(true);
  };

  useEffect(() => {
    context.userId &&
      getUserById(context.userId).then(({ data }) => {
        localStorage.setItem('user', JSON.stringify(data));
      });

    function getRequests() {
      getMyRequests()
        .then(({ data }) => {
          setRequests(data);
          if (context.role === 'Employee') {
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            localStorage.clear();
            setContext({ userId: null, user: null, role: null, token: null });
          }
        });
    }
    getRequests();

    if (context.role !== 'Employee') {
      function getReviews() {
        getMyReviews().then(({ data }) => {
          const subData = data.filter((item) => item.isApproved === null);
          setReviews(subData);
        });
        setLoading(false);
      }
      getReviews();
    }
  }, []);

  useEffect(() => {
    let ev;

    if (users && requests) {
      let events = requests.map((item) => {
        const user = users.find((user) => user.id === item.userId);
        return {
          title: user.firstName.concat(' ', user.lastName),
          start: new Date(item.startDate),
          end: new Date(item.endDate),
        };
      });

      if (reviews) {
        const rew = reviews.map((item) => {
          const user = users.find((user) => user.id === item.request.userId);
          return {
            title: user.firstName.concat(' ', user.lastName),
            start: new Date(item.request.startDate),
            end: new Date(item.request.endDate),
          };
        });

        events = events.concat(rew);
      }

      setEvents(events);
    }
  }, [users, requests, reviews]);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 0.8, margin: 5 }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <h2 style={{ marginBottom: 10, marginRight: 10 }}>{t('MyRecentRequests')}</h2>

            <Button
              variant="contained"
              color="primary"
              onClick={() => history.push('/my_requests')}
              style={{ marginRight: '50px', height: '30px' }}>
              {t('ViewAll')}
            </Button>
            <Button
              className="home__new-request"
              variant="contained"
              style={{ height: '30px', width: '140px', minWidth: '140px' }}
              onClick={() => {
                setNewRequestState(true);
              }}>
              {t('NewRequest')}
            </Button>
          </div>

          {!users || !requests ? (
            <CircularProgress />
          ) : users && requests && requests.length > 0 ? (
            <RequestTable data={requests.slice(0, 3)} users={users} short />
          ) : (
            <h3>{t('NoRequests')}</h3>
          )}
        </div>

        {context.role !== 'Employee' ? (
          <div style={{ flex: 1, margin: 5, marginRight: 15 }}>
            <h2 style={{ marginBottom: 20 }}>
              {t('NewRequestsForApproval')} ({reviews && reviews.length})
            </h2>
            {!users || !reviews ? (
              <CircularProgress />
            ) : users && reviews && reviews.length > 0 ? (
              <ReviewsTable data={reviews} users={users} short />
            ) : (
              <h3>{t('NoReviews')}</h3>
            )}
          </div>
        ) : null}
        <NewRequest
          isOpen={isNewRequestOpen}
          onClose={() => {
            setNewRequestState(false);
          }}
          calendar={calendar}
        />
      </div>
      {events && <Calendar func={funct} events={events} />}
    </div>
  );
}

export default React.memo(Home);
