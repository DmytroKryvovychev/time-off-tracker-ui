import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import { newUser } from '../Axios';
import { notifyAdmin } from '../../notifications';

export default function AddNewUser({ isOpen, onClose, roles, updateUsers }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const { t } = useTranslation(['admin', 'roles', 'notifications']);

  const handleAddNewUser = async () => {
    let error = { ...errors };

    error.firstName = firstName !== '' ? '' : `${t('NoEmpty')} ${t('FirstName')}`;
    error.lastName = lastName !== '' ? '' : `${t('NoEmpty')} ${t('LastName')}`;
    error.email = email !== '' ? '' : `${t('NoEmpty')} ${t('Email')}`;
    error.password = password !== '' ? '' : `${t('NoEmpty')} ${t('Password')}`;

    setErrors(error);

    if (
      Object.values(error).reduce((sum, err) => {
        return sum + err.length;
      }, 0) > 0
    ) {
      return;
    }

    const user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      role: roles[role],
    };

    await newUser(user)
      .then(() => {
        notifyAdmin('Successful New User Adding');
        onClose();
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          notifyAdmin('Network Error');
        } else if (err.response.status === 400) {
          notifyAdmin('400');
        } else {
          notifyAdmin('New user failure');
        }
      });
    updateUsers();
  };

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{t('RegisterNewUser')}</DialogTitle>
        <DialogContent>
          <form className="new-user__form">
            <TextField
              label={t('FirstName')}
              error={errors.firstName.length > 0}
              helperText={errors.firstName}
              variant="standard"
              fullWidth
              className="form-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label={t('LastName')}
              error={errors.lastName.length > 0}
              helperText={errors.lastName}
              variant="standard"
              fullWidth
              className="form-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label={t('Email')}
              error={errors.email.length > 0}
              helperText={errors.email}
              variant="standard"
              fullWidth
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label={t('Password')}
              error={errors.password.length > 0}
              helperText={errors.password}
              variant="standard"
              fullWidth
              className="form-input"
              type={'text'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl className="form-input">
              <InputLabel>{t('roles:Role')}</InputLabel>
              <Select
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                }}>
                {roles.map((obj, idx) => (
                  <MenuItem key={`key-${idx}-name${obj}`} value={idx}>
                    {t('roles:' + obj)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddNewUser} color="primary">
            {t('Add')}
          </Button>
          <Button onClick={onClose} color="primary" autoFocus>
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
}
