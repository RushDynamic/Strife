import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { UserContext } from '../UserContext.js';
import Login from '../components/Login.jsx';
import Register from './Register.jsx';
import Chat from '../components/Chat/Chat.jsx';
import { CssBaseline } from "@material-ui/core";

function App() {
  const [user, setUser] = useState({ username: null, accessToken: null });

  return (
    <Router>
      <CssBaseline />
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <Switch>
            <Route path='/' exact component={Chat} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
          </Switch>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
