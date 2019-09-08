// import * as Sentry from "@sentry/browser";
import React, { useContext, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
// import validator from "validator";
import green from "@material-ui/core/colors/green";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import firebase, { timestamp, db } from "./firebaseApp";
// import { authErrorMessages } from "./authErrorMessages";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { AuthContext } from "./Auth/AuthProvider";
import { async } from "q";

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

interface Player {
  name: string,
  height: string,
}

interface LoginData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors extends Player {
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
    height: ""
  } as Player);

  const [errors, setErrors] = useState({} as FormErrors);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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

    createPlayer();
  };

  const createPlayer = async () => {
    try {
      db.collection("players")
        .add({
          // trainerUid: firebase.auth().currentUser!.uid,
          name: values.name,
          height: values.height,
          deleted: false,
          createdAt: timestamp()
        })
        .then(() => {
          setDone(true)
        })
        .catch((reason: any) => {
          handleErrors({
            form: `メニューの登録に失敗しました。お手数をおかけしますが、しばらくしてから再度お試しください。${reason}`
          });
        })
        .then(() => loadingDone());
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
  }

  // const createAccount = async () => {
  //   try {
  //     const result = await firebase
  //       .auth()
  //       .signInWithEmailAndPassword(values.email, values.password);

  //     if (result && result.user) {
  //       setUser(result.user);
  //       redirectToTargetPage();
  //     }
  //   } catch (error) {
  //     if (error.code === "auth/wrong-password") {
  //       handleErrors({
  //         form:
  //           "メールアドレスが登録済みです。ログイン画面からログインしてください。"
  //       });
  //       loadingDone();
  //       return;
  //     }

  //     if (error.code !== "auth/user-not-found") {
  //       const errorMessage = `認証時にエラーが発生しました。エラーメッセージ: ${error}`;
  //       handleErrors({ form: errorMessage });
  //       loadingDone();
  //       return;
  //     }
  //   }

  //   try {
  //     const userCredential: firebase.auth.UserCredential = await firebase
  //       .auth()
  //       .createUserWithEmailAndPassword(values.email, values.password);

  //     const currentUser = userCredential.user!;

  //     await handleCreateUser(currentUser, values.name);

  //     setUser(currentUser);
  //     redirectToTargetPage();
  //   } catch (error) {
  //     // Sentry.captureMessage(
  //     //   `Create Account Error: ${JSON.stringify(error)}`,
  //     //   Sentry.Severity.Fatal
  //     // );
  //     // const errorMessage =
  //     //   authErrorMessages[error.code] ||
  //     //   `アカウントの作成に失敗しました。エラーメッセージ: ${error}`;
  //     // handleErrors({ form: errorMessage });
  //     loadingDone();
  //   }
  // };

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
    <React.Fragment>
      {done ? (
        <div>
          {values.name ? (
            <div>
              <Typography variant="body1" gutterBottom>
                {"Saved succefully"}
              </Typography>
              <Button onClick={() => history.push("/player-add")}>
                {"Back to the list"}
              </Button>
            </div>
          ) : (
              <div>
                <Typography variant="body1" gutterBottom>
                  {"menuAdded"}
                </Typography>
                <Button onClick={() => history.push("/menu")}>
                  {"Back to the list"}
                </Button>
                <Button >{"Add more"}</Button>
              </div>
            )}
        </div>
      ) : (
          <Box m={1} mt={10}>
            <Typography component="h1" variant="h5" gutterBottom>
              <IconButton onClick={() => history.goBack()}>
                <ArrowBackIcon />
              </IconButton>
              {"Player Add"}
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
                id="name"
                name="name"
                type="name"
                label={"Name"}
                placeholder=""
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                value={values.name}
                onChange={handleChange}
                error={!!errors.name}
              />
              {errors.name && (
                <FormHelperText className={classes.formHelperText} error>
                  {errors.name}
                </FormHelperText>
              )}

              <TextField
                id="height"
                name="height"
                type="height"
                label={"Height"}
                placeholder=""
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                value={values.height}
                onChange={handleChange}
                error={!!errors.height}
              />
              {errors.height && (
                <FormHelperText className={classes.formHelperText} error>
                  {errors.height}
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
                      {"Create"}
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
            
          </Box>

        )}
    </React.Fragment>
  );
}

export default (withRouter(PlayerAdd));
