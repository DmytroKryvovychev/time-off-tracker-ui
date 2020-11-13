import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Button, Avatar, Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { Context } from '../Context';

function Header() {
  const [anchor, setAnchor] = useState(null);
  const { t } = useTranslation('header');
  const [context, setContext] = useContext(Context);

  let history = useHistory();

  const handleClickAvatar = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };

  const handleLogout = () => {
    //localStorage.removeItem('role');
    localStorage.clear();
    setContext({ userId: null, user: null, role: null, token: null });
    setAnchor(null);
    history.push('/login');
  };

  const toHomePage = () => {
    history.push('/home');
  };

  useEffect(() => {
    console.log(localStorage.getItem('role'));
  }, [context]);

  //пофиксить появление меню...?
  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <h2 className="title" onClick={toHomePage}>
            Vacation
          </h2>
          {context.role ? (
            <>
              <Avatar
                src="https://gagadget.com/media/post_big/The_Elder_Scrolls_V_Skyrim.jpg"
                onClick={handleClickAvatar}>
                {context.role.substr(0, 2).toUpperCase()}
              </Avatar>
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
                <MenuItem onClick={handleCloseMenu}>{t('Profile')}</MenuItem>
                <MenuItem onClick={handleLogout}>{t('Logout')}</MenuItem>
              </Menu>
            </>
          ) : (
            <Button style={{ backgroundColor: 'white' }} onClick={() => history.push('/login')}>
              {t('Log in')}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </header>
  );
}

export default React.memo(Header);
