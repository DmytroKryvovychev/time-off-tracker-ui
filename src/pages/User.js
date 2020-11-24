import React, { useState, useEffect, useContext } from 'react';
import { Switch, Route, Link, useHistory, useLocation, Redirect } from 'react-router-dom';
import { Button, ButtonGroup } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Home from './Home';
import MyRequests from './MyRequests';
import OtherRequests from './OtherRequests';
import RequestActions from '../components/OtherRequests/RequestActions';

import { Context, Users } from '../Context';
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
    name: 'MyRequests',
    path: '/my_requests',
    exact: true,
    access: ['Manager', 'Employee'],
    main: () => <MyRequests />,
  },
  {
    name: 'OtherRequests',
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
  const location = useLocation();

  useEffect(() => {
    if (context.role === 'Admin') {
      history.replace('/admin');
      return;
    }

    setSelectedRoute(routes.findIndex((item) => history.location.pathname.includes(item.path)));
  }, [context, location]);

  useEffect(() => {
    getUsers('', '')
      .then(({ data }) => {
        setUsers(data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          setContext({ userId: null, user: null, role: null, token: null });
        }
      });
  }, [context.userId]);

  return (
    <div className="router__btn-group">
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
                    color={idx === selectedRoute ? 'primary' : 'default'}
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

      <div className="router__switch">
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
          <Route path="*" exect children={<Redirect to="/login" />}></Route>
        </Switch>
      </div>
    </div>
  );
}

export default User;
