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
  //const [token, setToken] = useState(accesstoken);
  const token = query.get("token");

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
          await authContext.setAttribute(result['UserAttributes']);
          history.push('home');
        },
        (error) => {
          console.log(error);
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
