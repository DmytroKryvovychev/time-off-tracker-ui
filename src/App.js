import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './components/Header';
import User from './pages/User';
import Login from './pages/Login';
import Admin from './pages/Admin';

import { Context, Users } from './Context';

//only for external Header  user check
const role = localStorage.getItem('role');
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const user = localStorage.getItem('user');

function App() {
  const [context, setContext] = useState({ userId, user, role, token });
  const [users, setUsers] = useState(null);
  return (
    <Users.Provider value={[users, setUsers]}>
      <Context.Provider value={[context, setContext]}>
        <div>
          <Header />
          <Switch>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/admin" exact>
              <Admin />
            </Route>
            <Route path="/">
              <User />
            </Route>
          </Switch>
        </div>
      </Context.Provider>
    </Users.Provider>
  );
}

export default App;
