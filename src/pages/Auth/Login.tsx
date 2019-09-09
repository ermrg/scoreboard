import React, { useContext, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import validator from "validator";
import green from "@material-ui/core/colors/green";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import firebase from "../firebaseApp";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import * as Sentry from "@sentry/browser";
import { AuthContext } from "../../_components";

const useStyles = makeStyles((theme: Theme) => ({
  formError: {
    color: theme.palette.error.main
  },
  buttonWrapper: {
    position: "relative",
    display: "inline-block"
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  },
  formHelperText: {
    marginBottom: 15
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  urlPrefix: {
    opacity: 0.6,
    fontSize: "0.5rem"
  },
  footer: {
    textAlign: "center"
  }
}));

interface LoginData {
  email: string;
  password: string;
}

interface FormErrors extends LoginData {
  form: string;
}

interface Props extends RouteComponentProps {}

function Login(props: Props) {
  const classes = useStyles();

  const { history, location } = props;

  const { setUser } = useContext(AuthContext);

  const [values, setValues] = useState({
    email: "",
    password: ""
  } as LoginData);

  const [errors, setErrors] = useState({} as FormErrors);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: any) => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    login();
    setLoading(false);
  };

  const login = async () => {
    try {
      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(values.email, values.password);

      if (!result || !result.user) {
        return;
      }
      setUser(result.user);
      redirectToTargetPage();
    } catch (error) {
      Sentry.captureMessage(
        `Auth error: ${JSON.stringify(error)}`,
        Sentry.Severity.Log
      );
      const errorMessage = `認証時にエラーが発生しました。エラーメッセージ: ${error}`;
      handleErrors({ form: errorMessage });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!validator.trim(values.email)) {
      errors.email = "Required";
    }

    if (!validator.trim(values.password)) {
      errors.password = "Required";
    }

    handleErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleErrors = (newErrors: { [key: string]: string }) => {
    setErrors(errors => ({
      ...errors,
      ...newErrors
    }));
  };

  const redirectToTargetPage = () => {
    let prevPath = "/";
    const storagePrePath = sessionStorage.getItem("prevPath");
    if (storagePrePath) {
      prevPath = storagePrePath;
      sessionStorage.removeItem("prevPath");
    } else if (location.state && location.state.prevPath) {
      prevPath = location.state.prevPath;
    }
    history.push(prevPath);
  };

  return (
    <Box m={1} mt={10}>
      <Typography component="h1" variant="h5" gutterBottom>
        <IconButton onClick={() => history.goBack()}>
          <ArrowBackIcon />
        </IconButton>
        {"Sign in"}
      </Typography>

      <form noValidate onSubmit={handleSubmit}>
        {errors.form ? (
          <Typography
            variant="body1"
            gutterBottom
            className={classes.formError}
          >
            {errors.form}
          </Typography>
        ) : (
          ""
        )}

        <TextField
          id="email"
          name="email"
          type="email"
          label={"Email"}
          placeholder=""
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
          value={values.email}
          onChange={handleChange}
          error={!!errors.email}
        />
        {errors.email && (
          <FormHelperText className={classes.formHelperText} error>
            {errors.email}
          </FormHelperText>
        )}

        <TextField
          id="password"
          name="password"
          type="password"
          label={"Password"}
          placeholder=""
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
          value={values.password}
          onChange={handleChange}
          error={!!errors.password}
        />
        {errors.password && (
          <FormHelperText className={classes.formHelperText} error>
            {errors.password}
          </FormHelperText>
        )}

        <Grid container justify="center" alignItems="center">
          <FormControl margin="normal" className={classes.formActions}>
            <div className={classes.buttonWrapper}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
              >
                {"Sign in"}
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </FormControl>
        </Grid>
      </form>
      <Box mt={4} className={classes.footer}>
        <Button onClick={() => history.push("/create-account")}>
          {"Click here if you do not have an account yet"}
        </Button>
      </Box>
    </Box>
  );
}

export default (withRouter(Login));
