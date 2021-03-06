import React from 'react';
import './App.css';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import AuthProvider, { AuthIsSignedIn, AuthIsNotSignedIn } from './contexts/authContext';

import SignIn from './routes/auth/signIn';
import SignUp from './routes/auth/signUp';
import VerifyCode from './routes/auth/verify';
import RequestCode from './routes/auth/requestCode';
import Home from './routes/home';
import CheckUser from './routes/auth/CheckUser';

let lightTheme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

lightTheme = responsiveFontSizes(lightTheme);

const SignInRoute: React.FunctionComponent = () => (
  <Router>
    <Switch>
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/verify" component={VerifyCode} />
      <Route path="/requestcode" component={RequestCode} />
      <Route path="/checkuser/" component={CheckUser} />
      <Route path="/" component={SignIn} />
    </Switch>
  </Router>
)

const MainRoute: React.FunctionComponent = () => (
  <Router>
    <Switch>
      <Route path="/checkuser/" component={CheckUser} />
      <Route path="/" component={Home} />
    </Switch>
  </Router>
)

const App: React.FunctionComponent = () => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <AuthProvider>
      <AuthIsSignedIn>
        <MainRoute />
      </AuthIsSignedIn>
      <AuthIsNotSignedIn>
        <SignInRoute />
      </AuthIsNotSignedIn>
    </AuthProvider>
  </ThemeProvider>
)

export default App;
