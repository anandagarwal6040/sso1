import React, { useState, useEffect, useContext } from 'react';

import * as cognito from '../libs/cognito';

export enum AuthStatus {
  Loading,
  SignedIn,
  SignedOut,
};

export interface IAuth {
  sessionInfo?: { email?: string; sub?: string; accessToken?: string; refreshToken?: string }
  attrInfo?: any
  authStatus?: AuthStatus
  signInWithEmail?: any
  signUpWithEmail?: any
  signOut?: any
  verifyCode?: any
  getSession?: any
  sendCode?: any
  getAttributes?: any
  setAttribute?: any
  getSessionInfoByToken?: any
};

const defaultState: IAuth = {
  sessionInfo: {},
  authStatus: AuthStatus.Loading,
};

export const AuthContext = React.createContext(defaultState);

export const AuthIsSignedIn: React.FunctionComponent = ({ children }) => {
  const { authStatus }: IAuth = useContext(AuthContext);

  return <>{authStatus === AuthStatus.SignedIn ? children : null}</>;
}

export const AuthIsNotSignedIn: React.FunctionComponent = ({ children }) => {
  const { authStatus }: IAuth = useContext(AuthContext);

  return <>{authStatus === AuthStatus.SignedOut ? children : null}</>;
}

const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);
  const [sessionInfo, setSessionInfo] = useState({});
  const [attrInfo, setAttrInfo] = useState([]);

  useEffect(() => {
    async function getSessionInfo() {
      try {
        const session: any = await getSession();
        setSessionInfo({
          accessToken: session.accessToken.jwtToken,
          refreshToken: session.refreshToken.token,
        });
        window.localStorage.setItem('accessToken', `${session.accessToken.jwtToken}`);
        window.localStorage.setItem('refreshToken', `${session.refreshToken.token}`);
        const attr: any = await getAttributes();
        setAttrInfo(attr);
        setAuthStatus(AuthStatus.SignedIn);
      } catch (err) {
        setAuthStatus(AuthStatus.SignedOut);
      }
    }
    getSessionInfo();
  }, [setAuthStatus, authStatus]);

  if (authStatus === AuthStatus.Loading) {
    return null;
  }

  async function getSessionInfoByToken(attr: any) {
    try {
      console.log("inside getSessionInfoByToken",attr);
      //const session: any = await getSession();
      setSessionInfo({
        accessToken: window.localStorage.getItem('accessToken'),
        refreshToken: window.localStorage.getItem('refreshToken')
      });
console.log("inside getSessionInfoByToken1");
        //await setAttribute(attr);
      //const attr: any = await getAttributes();
console.log("inside getSessionInfoByToken2");
      setAttrInfo(attr);
console.log("inside getSessionInfoByToken3");
      setAuthStatus(AuthStatus.SignedIn);
      console.log("inside getSessionInfoByToken before home");
      window.location.href = "/#/";
    } catch (err) {
      setAuthStatus(AuthStatus.SignedOut);
      window.location.href = '/#/signin';
      console.log("redirect sigin",err);
    }
  }
  async function signInWithEmail(email: string, password: string) {
    try {
      await cognito.signInWithEmail(email, password);
      setAuthStatus(AuthStatus.SignedIn);
    } catch (err) {
      setAuthStatus(AuthStatus.SignedOut);
      throw err;
    }
  }

  async function signUpWithEmail(email: string, password: string) {
    try {
      await cognito.signUpUserWithEmail(email, password);
    } catch (err) {
      throw err;
    }
  }

  function signOut() {
    cognito.signOut();
    setAuthStatus(AuthStatus.SignedOut);
  }

  async function verifyCode(email: string, code: string) {
    try {
      await cognito.verifyCode(email, code)
    } catch (err) {
      throw err
    }
  }

  async function getSession() {
    try {
      const session = await cognito.getSession();
      return session;
    } catch (err) {
      throw err;
    }
  }

  async function getAttributes() {
    try {
      const attr = await cognito.getAttributes();
      return attr;
    } catch (err) {
      throw err;
    }
  }

  async function setAttribute(attr: any) {
    try {
      const res = await cognito.setAttribute(attr);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function sendCode(email: string) {
    try {
      await cognito.sendCode(email)
    } catch (err) {
      throw err
    }
  }

  const state: IAuth = {
    authStatus,
    sessionInfo,
    attrInfo,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    verifyCode,
    getSession,
    sendCode,
    getAttributes,
    setAttribute,
    getSessionInfoByToken,
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
