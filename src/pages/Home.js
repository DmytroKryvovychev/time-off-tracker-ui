import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import { getMyRequests, getMyReviews, getUserById } from '../components/Axios';
import { Context, Users } from '../Context';
import NewRequest from './NewRequest';
import ReviewsTable from '../components/OtherRequests/ReviewsTable';
import RequestTable from '../components/RequestTable';
import Calendar from '../components/Calendar';
import { notifyHome } from '../notifications';

function Home() {
  const [isNewRequestOpen, setNewRequestState] = useState(false);
  const [requests, setRequests] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [events, setEvents] = useState(null);
  const { t } = useTranslation(['home', 'notifications']);

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
      getUserById(context.userId)
        .then(({ data }) => {
          localStorage.setItem('user', JSON.stringify(data));
        })
        .catch((err) => {
          if (err.message === 'Network Error') {
            notifyHome('Network Error');
          } else if (err.response.status === 400) {
            notifyHome('400');
          } else {
            notifyHome();
          }
        });

    function getRequests() {
      getMyRequests()
        .then(({ data }) => {
          setRequests(data);
        })
        .catch((err) => {
          if (err.message === 'Network Error') {
            notifyHome('Network Error');
          } else if (err.response.status === 400) {
            notifyHome('400');
          } else if (err.response.status === 401) {
            localStorage.clear();
            setContext({ userId: null, user: null, role: null, token: null });
          } else {
            notifyHome();
          }
        });
    }
    getRequests();

    if (context.role !== 'Employee') {
      function getReviews() {
        getMyReviews()
          .then(({ data }) => {
            const subData = data.filter((item) => item.isApproved === null);
            setReviews(subData);
          })
          .catch((err) => {
            if (err.message === 'Network Error') {
              notifyHome('Network Error');
            } else if (err.response.status === 400) {
              notifyHome('400');
            } else {
              notifyHome();
            }
          });
      }
      getReviews();
    }
  }, [context.userId]);

  useEffect(() => {
    let events;

    if (users && requests) {
      events = requests.map((item) => {
        const user = users.find((user) => user.id === item.userId);
        const startDay = new Date(item.startDate);
        const endDay = new Date(item.endDate);
        if (item.startDate !== item.endDate) {
          endDay.setHours(24);
        }
        return {
          title: user.firstName.concat(' ', user.lastName),
          start: startDay,
          end: endDay,
        };
      });

      if (reviews) {
        const rew = reviews.map((item) => {
          const user = users.find((user) => user.id === item.request.userId);
          const startDay = new Date(item.request.startDate);
          const endDay = new Date(item.request.endDate);
          if (item.request.startDate !== item.request.endDate) {
            endDay.setHours(24);
          }
          return {
            title: user.firstName.concat(' ', user.lastName),
            start: startDay,
            end: endDay,
          };
        });

        events = events.concat(rew);
      }

      setEvents(events);
    }
  }, [users, requests, reviews]);

  return (
    <div>
      <div className="home__content">
        {context.role !== 'Accountant' ? (
          <div className="home__requests">
            <div className="requests__content">
              <h2 className="requests__title">{t('MyRecentRequests')}</h2>

              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push('/my_requests')}
                className="requests__viewall-btn">
                {t('ViewAll')}
              </Button>
              <Button
                className="requests__newreq-btn"
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
        ) : null}

        {context.role !== 'Employee' ? (
          <div className="home__reviews">
            <h2 className="reviews__title">
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
      <ToastContainer />
    </div>
  );
}

export default React.memo(Home);
