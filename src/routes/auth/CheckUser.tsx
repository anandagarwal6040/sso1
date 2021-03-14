import React, { useEffect, useContext } from 'react';

import { useHistory } from 'react-router-dom';

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

  const history = useHistory();

  const authContext = useContext(AuthContext);

  const checkUser = async () => {
    fetch("https://magenta-pricey-chasmosaurus.glitch.me/userexists/", {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "token": token
      })
    })
      .then(res => res.json())
      .then(
        async (result) => {
          console.log("result", result);
          console.log("result", result['UserAttributes']);
          if (result['UserAttributes'].length) {
            window.localStorage.setItem('accessToken', token!);
            window.localStorage.setItem('refreshToken', referesh!);
            await authContext.getSessionInfoByToken();
          } else {
            console.log("not logged in");
            history.push('signin');
          }
        },
        (error) => {
          console.log(error);
          history.push('signin');
        }
      )
  }

  useEffect(() => {
    if (token!.length) {
      console.log("if ");
      checkUser();
    } else {
      console.log("sigin");
      history.push('signin');
    }
  });

  return (
    <>

    </>
  )
}

export default CheckUser;
