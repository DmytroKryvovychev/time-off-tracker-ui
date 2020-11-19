import React, { useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { TextField, Typography, Button, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import { Users, Context } from '../Context';
import { notifyLogin } from '../notifications';

function Login() {
  let history = useHistory();
  let location = useLocation();
  const { t } = useTranslation(['login', 'notifications']);

  const [context, setContext] = useContext(Context);
  const [users, setUsers] = useContext(Users);

  const [username, setUsername] = useState('mainadmin@mail.ru'); //'mainadmin@mail.ru'
  const [password, setPassword] = useState('mainadmin89M#'); //'mainadmin89M#'
  const [showPassword, setPasswordVisibility] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const checkForm = () => {
    let error = { ...errors };

    error.username = username !== '' ? '' : `${t('NoEmpty')} ${t('Username')}`;

    error.password = password !== '' ? '' : `${t('NoEmpty')} ${t('Password')}`;

    setErrors(error);

    if (
      Object.values(error).reduce((sum, err) => {
        return sum + err.length;
      }, 0) > 0
    ) {
      return;
    }

    const url = 'https://localhost:44381/auth/token';
    axios
      .post(url, { username: username, password: password })
      .then((response) => {
        const { data } = response;
        const user = users ? users.find((user) => user.id === data.userId) : null;
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('role', data.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(user));
        setContext({ userId: data.userId, user: user, role: data.role, token: data.token });
        history.replace(
          location.state
            ? location.state.from.pathname + location.state.from.search
            : data.role === 'Admin'
            ? '/admin'
            : '/home',
        );
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          notifyLogin('Network Error');
        } else if (
          err.response &&
          err.response.data.message === 'Username or password is incorrect'
        ) {
          setErrors({ username: t('IncorrectLoginData'), password: t('IncorrectLoginData') });
        } else if (err.response.status === 400) {
          notifyLogin('400');
        }
      });
  };

  const handleClickShowPassword = () => {
    setPasswordVisibility(!showPassword);
  };

  return (
    <div>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '100px',
        }}>
        <Typography
          variant="h4"
          align="center"
          style={{
            marginBottom: 10,
            color: 'blue',
          }}>
          {t('Title')}
        </Typography>
        <TextField
          label={t('Username')}
          error={errors.username.length > 0}
          helperText={errors.username}
          variant="standard"
          fullWidth
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 20, width: 300 }}
        />
        <TextField
          label={t('Password')}
          error={errors.password.length > 0}
          helperText={errors.password}
          variant="standard"
          fullWidth
          className="form-input"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          style={{ marginBottom: 20, width: 300 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          style={{ marginTop: 20, width: 150 }}
          onClick={checkForm}>
          {t('LogIn')}
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default React.memo(Login);
