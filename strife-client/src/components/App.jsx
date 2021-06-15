import React from 'react';
import Login from '../components/Login.jsx';
import Chat from '../components/Chat/Chat.jsx';
import { CssBaseline } from "@material-ui/core";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Chat />
    </div>
  );
}

export default App;
