import React, { useEffect, useState, useContext, useCallback } from 'react';

import { AuthContext } from '../../contexts/authContext';

import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function CheckUser() {
  let query = useQuery();
  const token = query.get("token");
  const referesh = query.get("referesh");
  const idToken = query.get("idToken");
  const authContext = useContext(AuthContext);
  const [count, setCount] = useState(0);

  const checkUserSuccesss = useCallback(async (result: any) => {
    if (result.client_id!) {
      const clientUserId = result.client_id + '.' + result.username;

      const cogAcessTknKey = 'CognitoIdentityServiceProvider.' + clientUserId + '.accessToken';
      const cogIdTknKey = 'CognitoIdentityServiceProvider.' + clientUserId + '.idToken';
      const cogRefreshTknKey = 'CognitoIdentityServiceProvider.' + clientUserId + '.refreshToken';
      const cogClockDriftKey = 'CognitoIdentityServiceProvider.' + clientUserId + '.clockDrift';
      const cogLastAuthUserKey = 'CognitoIdentityServiceProvider.' + result.client_id + '.LastAuthUser';

      window.localStorage.setItem(cogAcessTknKey, token!);
      window.localStorage.setItem(cogIdTknKey, idToken!);
      window.localStorage.setItem(cogRefreshTknKey, referesh!);
      window.localStorage.setItem(cogClockDriftKey, '0');
      window.localStorage.setItem(cogLastAuthUserKey, result.username!);
      window.localStorage.setItem('accessToken', token!);
      window.localStorage.setItem('refreshToken', referesh!);
      window.localStorage.setItem('idToken', idToken!);
    }
    await authContext.getSessionInfoByToken();
  }, [idToken, referesh, token, authContext]);

  const checkUser = useCallback(async () => {
    if (count === 0) {
      await setCount(prev => prev + 1);
      let response = await fetch("https://magenta-pricey-chasmosaurus.glitch.me/userexists/", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "token": token
        })
      });
      if (response) {
        response = await response.json();
        await checkUserSuccesss(response);
      }
    }
  }, [checkUserSuccesss, token, count]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (<></>);
}

export default CheckUser;
