import React, { useState, useEffect, useContext } from 'react';
import { Switch, Route, Link, useHistory, Redirect } from 'react-router-dom';
import { Button, ButtonGroup } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Home from './Home';
import MyRequests from './MyRequests';
import OtherRequests from './OtherRequests';
import RequestActions from '../components/OtherRequests/RequestActions';

import { Context, Users } from '../Context';
import NewRequest from './NewRequest';
import { getUsers } from '../components/Axios';
import PersonalRequest from './PersonalRequest';

const routes = [
  {
    name: 'Home',
    path: '/home',
    exact: true,
    access: ['Accountant', 'Manager', 'Employee'],
    main: () => <Home />,
  },
  {
    name: 'My Requests',
    path: '/my_requests',
    exact: true,
    access: ['Accountant', 'Manager', 'Employee'],
    main: () => <MyRequests />,
  },
  {
    name: 'Other Requests',
    path: '/other_requests',
    exact: true,
    access: ['Accountant', 'Manager'],
    main: () => <OtherRequests />,
  },
];

function User() {
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [context, setContext] = useContext(Context);
  const [users, setUsers] = useContext(Users);
  const { t } = useTranslation('user');
  let history = useHistory();

  useEffect(() => {
    if (context.role === 'Admin') {
      history.replace('/admin');
      return;
    }

    setSelectedRoute(routes.findIndex((item) => item.path === history.location.pathname));
  }, [context, history.location.pathname]);

  useEffect(() => {
    if (!context.token) {
      history.replace('/login');
      return;
    }

    getUsers('', '')
      .then(({ data }) => {
        setUsers(data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          localStorage.clear();
          setContext({ userId: null, user: null, role: null, token: null });
        }
      });
  }, [context.userId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 65px)' }}>
      <div className="sidebar">
        <ButtonGroup orientation="vertical" style={{ width: '100%' }}>
          {routes.map((route, idx) => {
            if (route.access.includes(context.role))
              return (
                <Link key={`path-${route.name}-${idx}`} to={route.path}>
                  <Button
                    disableElevation
                    className="button"
                    variant={idx === selectedRoute ? 'contained' : 'text'}
                    color={idx === selectedRoute ? 'primary' : ''}
                    fullWidth
                    onClick={() => {
                      setSelectedRoute(idx);
                    }}>
                    {t(route.name)}
                  </Button>
                </Link>
              );
          })}
        </ButtonGroup>
      </div>

      <div style={{ flex: 1, padding: '10px', height: '100%' }}>
        <Switch>
          {routes.map((route, index) => {
            if (route.access.includes(context.role))
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  render={({ location }) =>
                    context.token ? (
                      <route.main />
                    ) : (
                      <Redirect
                        to={{
                          pathname: '/login',
                          state: { from: location },
                        }}
                      />
                    )
                  }
                />
              );
          })}
          <Route
            path="/my_requests/:id"
            exect
            render={({ location }) =>
              context.token ? (
                <PersonalRequest isOpen={true}></PersonalRequest>
              ) : (
                <Redirect
                  to={{
                    pathname: '/login',
                    state: { from: location },
                  }}
                />
              )
            }></Route>
          <Route
            path="/other_requests/actions"
            render={({ location }) =>
              context.token ? (
                <RequestActions />
              ) : (
                <Redirect
                  to={{
                    pathname: '/login',
                    state: { from: location },
                  }}
                />
              )
            }></Route>
          <Route path="*" exect children={<Redirect to="/home" />}></Route>
        </Switch>
      </div>
    </div>
  );
}

export default User;
