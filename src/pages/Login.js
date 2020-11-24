import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { TextField, Button, InputAdornment, IconButton } from '@material-ui/core';
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

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

    const url = 'https://timeofftrackerwebapi2020.azurewebsites.net//auth/token';
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
        } else if (err.response && err.response.status === 400) {
          notifyLogin('400');
        } else {
          notifyLogin('');
        }
      });
  };

  const handleClickShowPassword = () => {
    setPasswordVisibility(!showPassword);
  };

  useEffect(() => {
    if (context.role === 'Admin') {
      history.push('/admin');
    } else if (['Accountant', 'Manager', 'Employee'].includes(context.role)) {
      history.push('/home');
    }
  }, []);

  return (
    <div>
      <form className="login__form">
        <h1 className="login__title">{t('Title')}</h1>
        <TextField
          label={t('Username')}
          error={errors.username.length > 0}
          helperText={errors.username}
          variant="standard"
          fullWidth
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          className="login__btn"
          onClick={checkForm}>
          {t('LogIn')}
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default React.memo(Login);
