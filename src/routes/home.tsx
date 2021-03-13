import React, { useContext } from 'react';

import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import Link from '@material-ui/core/Link';

//import logoImage from './logo.png';

import { AuthContext } from '../contexts/authContext';

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    textAlign: 'center',
  },
  session: {
    width: '80vw',
    overflow: 'auto',
    overflowWrap: 'break-word',
    fontSize: '16px',
  },
  hero: {
    width: '100%',
    background: 'rgb(220,220,220)',
  },
}));

export default function Home() {
  const classes = useStyles();

  const history = useHistory();

  const auth = useContext(AuthContext);
console.log(auth.attrInfo);
  function signOutClicked() {
    auth.signOut();
    history.push('/');
  }

  return (
    <Grid container>
      <Grid className={classes.root} container direction="column" justify="center" alignItems="center">
        <Box className={classes.hero} p={4}>
          <Grid className={classes.root} container direction="column" justify="center" alignItems="center">

            <Box m={2}>
              Hi {auth.attrInfo[3].Value} you are logged in!!!
                Click here to navigate to another server.
            </Box>
            <Box m={2}>
              <Button onClick={signOutClicked} variant="contained" color="primary">
                Sign Out
              </Button>
            </Box>
          </Grid>
        </Box>
        {/*<Box m={2}>
          <Typography variant="h5">Session Info</Typography>
          <pre className={classes.session}>{JSON.stringify(auth.sessionInfo, null, 2)}</pre>
        </Box>
        <Box m={2}>
          <Typography variant="h5">User Attributes</Typography>
          <pre className={classes.session}>{JSON.stringify(auth.attrInfo, null, 2)}</pre>
        </Box>*/}
      </Grid>
    </Grid>
  );
}
