import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { newUser } from '../Axios';

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
  const { t } = useTranslation(['admin', 'roles']);

  const handleAddNewUser = async () => {
    let error = { ...errors };

    error.firstName = firstName !== '' ? '' : `${t('No empty')} ${t('First Name')}`;
    error.lastName = lastName !== '' ? '' : `${t('No empty')} ${t('Last Name')}`;
    error.email = email !== '' ? '' : `${t('No empty')} ${t('Email')}`;
    error.password = password !== '' ? '' : `${t('No empty')} ${t('Password')}`;

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

    await newUser(user).then(() => onClose());
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
        <DialogTitle id="alert-dialog-title">{t('Register new user')}</DialogTitle>
        <DialogContent>
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <TextField
              label={t('First Name')}
              error={errors.firstName.length > 0}
              helperText={errors.firstName}
              variant="standard"
              fullWidth
              className="form-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ marginBottom: 20, width: 300 }}
            />
            <TextField
              label={t('Last Name')}
              error={errors.lastName.length > 0}
              helperText={errors.lastName}
              variant="standard"
              fullWidth
              className="form-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ marginBottom: 20, width: 300 }}
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
              style={{ marginBottom: 20, width: 300 }}
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
              style={{ marginBottom: 20, width: 300 }}
            />
            <FormControl style={{ width: '100%' }}>
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
    </div>
  );
}
