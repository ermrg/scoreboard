// import * as Sentry from "@sentry/browser";
import React, { useContext, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
// import validator from "validator";
import HomeIcon from "@material-ui/icons/Home";
import green from "@material-ui/core/colors/green";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import firebase from "./firebaseApp";
// import { authErrorMessages } from "./authErrorMessages";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { AuthContext } from "./Auth/AuthProvider";

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
  name: string;
  email: string;
  password: string;
}

interface FormErrors extends LoginData {
  form: string;
}

interface Props extends RouteComponentProps {
  handleCreateUser: any;
}

function PlayerAdd(props: Props) {
  const classes = useStyles();

  const { history, location, handleCreateUser } = props;

  const { setUser } = useContext(AuthContext);

  const [values, setValues] = useState({
    name: "",
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
      loadingDone();
      return;
    }

    createAccount();
  };

  const createAccount = async () => {
    try {
      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(values.email, values.password);

      if (result && result.user) {
        setUser(result.user);
        redirectToTargetPage();
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        handleErrors({
          form:
            "メールアドレスが登録済みです。ログイン画面からログインしてください。"
        });
        loadingDone();
        return;
      }

      if (error.code !== "auth/user-not-found") {
        const errorMessage = `認証時にエラーが発生しました。エラーメッセージ: ${error}`;
        handleErrors({ form: errorMessage });
        loadingDone();
        return;
      }
    }

    try {
      const userCredential: firebase.auth.UserCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password);

      const currentUser = userCredential.user!;

      await handleCreateUser(currentUser, values.name);

      setUser(currentUser);
      redirectToTargetPage();
    } catch (error) {
      // Sentry.captureMessage(
      //   `Create Account Error: ${JSON.stringify(error)}`,
      //   Sentry.Severity.Fatal
      // );
      // const errorMessage =
      //   authErrorMessages[error.code] ||
      //   `アカウントの作成に失敗しました。エラーメッセージ: ${error}`;
      // handleErrors({ form: errorMessage });
      loadingDone();
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // if (!validator.trim(values.name)) {
    //   errors.name = t("Required");
    // }

    // if (!validator.trim(values.email)) {
    //   errors.email = t("Required");
    // }

    // if (!validator.trim(values.password)) {
    //   errors.password = t("Required");
    // }

    handleErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleErrors = (newErrors: { [key: string]: string }) => {
    setErrors(errors => ({
      ...errors,
      ...newErrors
    }));
  };

  const loadingDone = () => {
    setLoading(false);
    window.scrollTo(0, 0);
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
        <IconButton>
          <HomeIcon />
        </IconButton>
        {"Home"}
      </Typography>
    </Box>
  );
}

export default (withRouter(PlayerAdd));
