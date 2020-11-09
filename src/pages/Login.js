import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { TextField, Typography, Button, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import axios from 'axios';

import { axiosApi } from '../config';
import { Users, Context } from '../Context';

const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

function Login() {
  let history = useHistory();
  let location = useLocation();

  const [context, setContext] = useContext(Context);
  const [users, setUsers] = useContext(Users);

  const [email, setEmail] = useState('mainadmin@mail.ru'); //'mainadmin@mail.ru'
  const [password, setPassword] = useState('mainadmin89M#'); //'mainadmin89M#'
  const [showPassword, setPasswordVisibility] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const checkForm = () => {
    let error = { ...errors };

    // error.email =
    //   email !== ''
    //     ? emailRegex.test(email)
    //       ? ''
    //       : 'invalid email address'
    //     : 'no empty email address';

    // error.password =
    //   password !== ''
    //     ? password.length < 6
    //       ? 'minimum 6 characaters required'
    //       : ''
    //     : 'no empty password';

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
      .post(url, { username: email, password: password })
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
      .catch((err) => console.log(err.response.data));
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
          Login
        </Typography>
        <TextField
          label="Email"
          error={errors.email.length > 0}
          helperText={errors.email}
          variant="standard"
          fullWidth
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 20, width: 300 }}
        />
        <TextField
          label="Password"
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
          Log In
        </Button>
      </form>
    </div>
  );
}

export default React.memo(Login);
