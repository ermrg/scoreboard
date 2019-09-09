import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { makeStyles, Link } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
  wrapper: {
    padding: 16
  },
  pageHeading: {
    borderBottom: "1px solid #bbb",
    position: "relative",
    boxShadow: "0px 0px 3px #bbb",
    padding: "6px 10px 0px 10px",
    height: "40px",
  },
  pageTitle: {
    position: "relative"
  },
  welcomeMessage: {
    display: "block",
    textAlign: "center",
    color: "#588796",
  }
}));

interface Props extends RouteComponentProps {
  handleCreateUser: any;
}

function PlayerAdd(props: Props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <Typography
          component="h1"
          variant="h5"
          className={classes.pageTitle}
          gutterBottom
        >
          {/* {"Home"} */}

        </Typography>
        <div className={classes.welcomeMessage}>
          <Typography
            component="h3"
            variant="h5"
          >
          Welcome to score board
          </Typography>
        </div>
      

      </div>
    </React.Fragment>
  );
}

export default (withRouter(PlayerAdd));
