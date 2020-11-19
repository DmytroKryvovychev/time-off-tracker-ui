import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import { getUsers } from '../components/Axios';
import { Context } from '../Context';
import UsersTable from '../components/Admin/UsersTable';
import { notifyAdmin } from '../notifications';

function Admin() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('');
  const [role, setRole] = useState(-1);
  const [context, setContext] = useContext(Context);
  const { t } = useTranslation(['admin', 'roles', 'notifications']);
  let history = useHistory();

  useEffect(() => {
    if (context.role !== 'Admin') {
      history.replace('/home');
      return;
    }

    handleGetUsers();
  }, []);

  const handleGetUsers = async () => {
    setLoading(true);
    const filterRole = role === -1 ? '' : roles[role];
    await getUsers(filter, filterRole)
      .then(({ data }) => {
        const filteredData = data.filter(
          (item) => item.role !== 'Admin' && item.role !== 'Accountant',
        );
        setData(filteredData);
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          notifyAdmin('Network Error');
        } else if (err.response.status === 400) {
          notifyAdmin('400');
        } else {
          notifyAdmin();
        }
      });
    setLoading(false);
  };

  //live search
  // const handleFilterName = () => {
  //   const filteredData = filter
  //     ? data.filter(
  //         (item) =>
  //           item.firstName.toLowerCase().includes(filter.toLowerCase()) ||
  //           item.lastName.toLowerCase().includes(filter.toLowerCase()),
  //       )
  //     : data;

  //   return role === -1 ? filteredData : filteredData.filter((item) => item.role === roles[role]);
  // };

  const roles = ['Employee', 'Manager'];

  return (
    <div>
      <div className="admin__form">
        <TextField
          label={t('FilterByName')}
          variant="standard"
          className="admin__form-input"
          onChange={(e) => setFilter(e.target.value)}
        />
        <FormControl className="admin__filter-role">
          <InputLabel>{t('FilterByRole')}</InputLabel>
          <Select
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
            }}>
            <MenuItem value={-1}>{t('Any')}</MenuItem>
            {roles.map((obj, idx) => (
              <MenuItem key={`key-${idx}-name${obj}`} value={idx}>
                {t('roles:' + obj)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="secondary"
          className="filter__btn"
          onClick={() => handleGetUsers()}>
          {t('Filter')}
        </Button>
      </div>

      <div className="users__content">
        {!isLoading ? (
          <UsersTable data={data} roles={roles} updateUsers={handleGetUsers} />
        ) : (
          <CircularProgress />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default React.memo(Admin);
