import React, { useState } from 'react';
import './assets/main.css';
import Dashboard from './Dashboard';
import Header from './Header';
import UserPortal, { IUser } from './UserPortal';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Profile from './Profile';

const App = () => {
  const [user, setUser] = useState<IUser>();

  return (
    <div className='App w-screen h-screen bg-white'>
      <Router>
        <Header user={user} />
        <Switch>
          <Route path='/userPortal'>
            <UserPortal setUser={setUser} />
          </Route>
          <Route path='/profile'>
            <Profile user={user} setUser={setUser} />
          </Route>
          <Route path='/'>
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
