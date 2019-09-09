import * as Sentry from "@sentry/browser";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Fab from "@material-ui/core/Fab";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

// import gimmyLogo from "../assets/images/gimmy_white.svg";
import CircularProgress from "@material-ui/core/CircularProgress";
// import authBg from "../assets/images/auth_bg.png";
import { AuthContext } from "./AuthProvider";
import firebase, { timestamp, db } from "../firebaseApp";
import logo from '../../assets/images/logo.png';

const useStyles = makeStyles((theme: Theme) => ({
  top: {
    height: "calc(100vh)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
    backgroundImage: `url()`,
    backgroundSize: "cover",
    color: "#fff",
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1100
  },
  logoWrapper: {
    marginBottom: 10
  },
  logo: {
    width: "100%",
    maxWidth: 300
  },
  about: {
    marginBottom: 60
  },
  error: {
    color: theme.palette.error.main,
    maxWidth: 300
  },
  loginButtons: {
    display: "flex",
    flexDirection: "column",
    "& img": {
      paddingRight: 5
    },
    "& button": {
      marginBottom: 20
    },
    "& .facebook": {
      backgroundColor: "#3B5998"
    },
    "& .twitter": {
      backgroundColor: "#1C9DEC"
    },
    "& .google": {
      backgroundColor: "#ffffff",
      color: "#484848"
    },
    "& .email": {
      backgroundColor: "#ffffff",
      color: "#484848"
    }
  },
  aboutTerms: {
    marginTop: 30
  }
}));

interface Props extends RouteComponentProps {}

function Auth(props: Props) {
  const classes = useStyles();

  const { history, location } = props;

  const { setUser, loadingAuthState } = useContext(AuthContext);

  const [error, setError] = useState("");

  const [processingAfterRedirect, setProcessingAfterRedirect] = useState(false);

  useEffect(() => {
    savePrevPath();

    firebase
      .auth()
      .getRedirectResult()
      .then(result => {
        // ログアウトしても、このコールバックが実行される場合があります。
        // そのため、firebase.auth().currentUser もチェックして、
        // 存在しない場合は処理がしないようにしています。
        if (!result || !result.user || !firebase.auth().currentUser) {
          return;
        }

        setProcessingAfterRedirect(true);

        return setTraineeProfile().then(() => {
          setUser(result.user);
          redirectToTargetPage();
        });
      })
      .catch(error => {
        setProcessingAfterRedirect(false);
        handleAuthError(error);
      });
  }, []);

  const setTraineeProfile = async () => {
    if (await isTraineeExists()) {
      return;
    }

    const currentUser = firebase.auth().currentUser!;

    // download img from url
    const response = await downloadPhoto(currentUser.photoURL);
    const fileObj = await response.blob();

    // resize
    // const resizedPhoto = await resizePhoto(fileObj, 240, 240);

    // store the img to Storage
    const ref = firebase
      .storage()
      .ref()
      .child(`images/profiles/${currentUser.uid}/${currentUser.uid}.png`);
    // await ref.put(resizedPhoto.obj);

    const photoURL = await ref.getDownloadURL();

    const privateData: { [field: string]: any } = {
      email: currentUser.email,
      photoURL,
      name: currentUser.displayName,
      createdAt: timestamp()
    };
    await db
      .collection("trainees")
      .doc(currentUser.uid)
      .collection("private")
      .doc("private")
      .set(privateData);
  };

  const downloadPhoto = (url: any) => {
    return fetch(url);
  };

  const isTraineeExists = async () => {
    const doc = await db
      .collection("trainees")
      .doc(firebase.auth().currentUser!.uid)
      .collection("private")
      .doc("private")
      .get();
    return doc.exists;
  };

  const auth = (snsName: string) => {
    let provider: firebase.auth.AuthProvider;
    switch (snsName) {
      case "facebook":
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case "twitter":
        provider = new firebase.auth.TwitterAuthProvider();
        break;
      case "google":
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      default:
        throw new Error("Unsupported SNS: " + snsName);
    }

    firebase
      .auth()
      .signInWithRedirect(provider)
      .catch(handleAuthError);
  };

  const handleAuthError = (error: firebase.auth.Error) => {
    Sentry.captureMessage(
      `Auth error: ${JSON.stringify(error)}`,
      Sentry.Severity.Log
    );
    const errorMessage = `認証時にエラーが発生しました。エラーメッセージ: ${error}`;
    setError(errorMessage);
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

  const savePrevPath = () => {
    if (location.state && location.state.prevPath) {
      sessionStorage.setItem("prevPath", location.state.prevPath);
    }
  };

  if (loadingAuthState || processingAfterRedirect) {
    return (
      <div style={{ paddingTop: "20%", textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.top}>
      <div className={classes.logoWrapper}>
        <img src={""} alt="GIMMY" className={classes.logo} />
      </div>
      <Typography variant="h6" className={classes.about}>
        {"すばやくカンタンにレッスン予約"}
      </Typography>
      {error && (
        <Typography variant="body1" gutterBottom className={classes.error}>
          {error}
        </Typography>
      )}
      <div className={classes.loginButtons}>
        <Fab
          variant="extended"
          color="primary"
          onClick={() => auth("google")}
          className={"google"}
        >
          <img src={""} alt="Google" />
          {"Sign in with Google"}
        </Fab>
        <Fab
          variant="extended"
          color="primary"
          onClick={() => history.push("/login")}
          className={"email"}
        >
          {"Sign in with Email"}
        </Fab>
      </div>

      <div className={classes.aboutTerms}>
        <Typography>
          {(
            <React.Fragment>
              By singing up, you agree to our{" "}
              <Link
                color="inherit"
                underline="always"
                href={`https://gimmy.co/terms.html?from=${encodeURIComponent(
                  "https://trainee.gimmy.co/"
                )}`}
              >
                Terms of use
              </Link>{" "}
              and{" "}
              <Link
                color="inherit"
                underline="always"
                href={`https://gimmy.co/privacy.html?from=${encodeURIComponent(
                  "https://trainee.gimmy.co/"
                )}`}
              >
                Privacy policy
              </Link>
              .
            </React.Fragment>
          )}

          {(
            <React.Fragment>
              <Link
                color="inherit"
                underline="always"
                href={`https://gimmy.co/terms.html?from=${encodeURIComponent(
                  "https://trainee.gimmy.co/"
                )}`}
              >
                利用規約
              </Link>
              と
              <Link
                color="inherit"
                underline="always"
                href={`https://gimmy.co/privacy.html?from=${encodeURIComponent(
                  "https://trainee.gimmy.co/"
                )}`}
              >
                個人情報保護方針
              </Link>
              に<br />
              ご同意の上ご利用ください。
            </React.Fragment>
          )}
        </Typography>
      </div>
    </div>
  );
}

export default (withRouter(Auth));
