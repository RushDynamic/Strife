import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from '../store.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { UserContext } from '../UserContext.js';
import Login from '../components/Login.jsx';
import Register from './Register.jsx';
import Chat from '../components/Chat/Chat.jsx';
import { CssBaseline, adaptV4Theme } from '@mui/material';
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';

function App() {
  const [user, setUser] = useState({
    username: null,
    avatarUrl: null,
    accessToken: null,
  });
  const darkTheme = createTheme(
    adaptV4Theme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#1fd1f9',
        },
        secondary: {
          main: '#CD31F0',
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
    }),
  );

  return (
    <Router>
      <StyledEngineProvider injectFirst>
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
      </StyledEngineProvider>
    </Router>
  );
}

export default App;
