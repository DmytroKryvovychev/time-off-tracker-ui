import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Button, Avatar, Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import localRu from 'moment/locale/ru';
import localEn from 'moment/locale/en-gb';

import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';

import { Context } from '../Context';

function Header() {
  const [anchor, setAnchor] = useState(null);
  const { t, i18n } = useTranslation('header');
  const [context, setContext] = useContext(Context);

  let history = useHistory();

  const handleClickAvatar = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    setContext({ userId: null, user: null, role: null, token: null });
    setAnchor(null);
    history.push('/login');
  };

  const toHomePage = () => {
    history.push('/home');
  };

  const selectedLanguage = (lng) => {
    return lng === 'ru';
  };

  const changeLanguage = () => {
    const lng = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(lng);
    moment.updateLocale(lng, lng === 'ru' ? localEn : localRu);
  };

  useEffect(() => {
    changeLanguage();
  }, []);

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <h2 className="title" onClick={toHomePage}>
            Vacation
          </h2>
          <div className="lng__switch">
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>EN</Grid>
              <Grid item>
                <Switch
                  checked={selectedLanguage(i18n.language)}
                  onChange={() => {
                    changeLanguage();
                  }}
                />
              </Grid>
              <Grid item>RU</Grid>
            </Grid>
          </div>

          {context.role && context.userId ? (
            <>
              <Avatar onClick={handleClickAvatar}>{context.role.substr(0, 2).toUpperCase()}</Avatar>
              <Menu
                elevation={5}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                anchorEl={anchor}
                keepMounted
                open={Boolean(anchor)}
                onClose={handleCloseMenu}>
                {/* <MenuItem onClick={handleCloseMenu}>{t('Profile')}</MenuItem> */}
                <MenuItem onClick={handleLogout}>{t('Logout')}</MenuItem>
              </Menu>
            </>
          ) : (
            <Button className="header__login-btn" onClick={() => history.push('/login')}>
              {t('Login')}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </header>
  );
}

export default React.memo(Header);
