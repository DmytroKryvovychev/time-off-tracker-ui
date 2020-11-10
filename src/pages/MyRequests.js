import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import RequestTable from '../components/RequestTable';
import RequestFilter from '../components/RequestFilter';
import NewRequest from './NewRequest';
import { getMyRequests, getMyRequestsByFilter } from '../components/Axios';
import { Users } from '../Context';

function MyRequests() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isNewRequestOpen, setNewRequestState] = useState(false);

  const [users, setUsers] = useContext(Users);

  const handleFilter = (fromDate, toDate, stateId, typeId) => {
    setLoading(true);
    getMyRequestsByFilter(fromDate, toDate, stateId, typeId).then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    async function getRequests() {
      await getMyRequests().then(({ data }) => {
        setData(data);
        setLoading(false);
      });
    }

    getRequests();
  }, []);

  return (
    <div>
      <h2>Statistics {new Date().getFullYear()}</h2>
      <div className="statistics">
        <div className="statistics__text">
          <p>Paid leave: 11 days used</p>
          <p>Administrative leave: 11 days used</p>
        </div>

        <div className="statistics__text">
          <p>Sick leave (no document): 11 days used</p>
          <p>Sick leave (with documents): 0 days used</p>
        </div>

        <Button
          variant="contained"
          color="secondary"
          style={{ height: '40px' }}
          onClick={() => {
            setNewRequestState(true);
          }}>
          New Request
        </Button>
      </div>

      <h2>My Requests </h2>

      <RequestFilter handleFilter={handleFilter} />
      {!users || !data ? (
        <CircularProgress />
      ) : users && data && data.length > 0 ? (
        <RequestTable data={data} users={users} />
      ) : (
        <h3>No requests</h3>
      )}
      <NewRequest
        isOpen={isNewRequestOpen}
        onClose={() => {
          setNewRequestState(false);
        }}
      />
    </div>
  );
}

export default MyRequests;
