import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from '../store.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { UserContext } from '../UserContext.js';
import Login from '../components/Login.jsx';
import Register from './Register.jsx';
import Chat from '../components/Chat/Chat.jsx';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

function App() {
  const [user, setUser] = useState({
    username: null,
    avatarUrl: null,
    accessToken: null,
  });
  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#1fd1f9',
      },
      secondary: {
        main: '#b621fe',
      },
      background: {
        default: '#1b1d1e',
        paper: '#181a1b',
      },
      text: {
        primary: '#cdcbc9',
        secondary: '#a8a8a8',
      },
    },
  });

  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider store={store}>
          <div className="App">
            <UserContext.Provider value={{ user, setUser }}>
              <Switch>
                <Route path="/" exact component={Chat} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
              </Switch>
            </UserContext.Provider>
          </div>
        </Provider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
