import React, { useEffect, useContext,useCallback } from 'react';

import { AuthContext } from '../../contexts/authContext';

import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function CheckUser() {
  let query = useQuery();
  console.log("token", query.get("token"));
  console.log("referesh", query.get("referesh"));
  const token = query.get("token");
  const referesh = query.get("referesh");

  const authContext = useContext(AuthContext);

const checkUser = useCallback(async () => {
        fetch("https://magenta-pricey-chasmosaurus.glitch.me/userexists/", {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "token": token
          })
        })
          .then(res => res.json())
          .then(
            async (result:any) => {
              console.log("result", result);
              console.log("result", result['UserAttributes']);
              if (result['UserAttributes']!) {
                window.localStorage.setItem('accessToken', token!);
                window.localStorage.setItem('refreshToken', referesh!);
              }
              await authContext.getSessionInfoByToken(result['UserAttributes']);
            },
            (error) => {
              console.log(error);
            }
          )
      },[authContext, referesh, token]
)

  useEffect(() => {
      console.log("if ");
      checkUser();
  },[checkUser]);

  return (<></>);
}

export default CheckUser;
