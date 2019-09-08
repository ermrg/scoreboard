import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import {AuthContext} from "./AuthProvider";
import CircularProgress from "@material-ui/core/CircularProgress";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const {loadingAuthState, authenticated} = useContext(AuthContext);

  if (loadingAuthState) {
    return (
      <div style={{ paddingTop: "20%", textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Route
      {...rest}
      render={routeProps =>
        authenticated ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={{pathname: "/auth", state: {prevPath: rest.path}}} />
        )
      }
    />
  );
};

export default PrivateRoute
