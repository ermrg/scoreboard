import React, { useState } from "react";
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
import firebase, { timestamp, db } from "../firebaseApp";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { async } from "q";

const useStyles = makeStyles((theme: Theme) => ({
  formError: {
    color: theme.palette.error.main
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
  pageHeadingTitle: {

  },
  addButton: {
    position: "absolute",
    right: "5px",
    bottom: 0
  },
  wrapper: {
    padding: 16
  },
  backButton: {
    padding: 0
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

interface Team {
  name: string,
  manager: string,
}

interface FormErrors extends Team {
  form: string;
}

interface Props extends RouteComponentProps { }

function TeamAdd(props: Props) {
  const classes = useStyles();

  const { history } = props;

  const [values, setValues] = useState({
    name: "",
    manager: ""
  } as Team);

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

    createTeam();
  };

  const createTeam = async () => {
    try {
      db.collection("teams")
        .add({
          name: values.name,
          manager: values.manager,
          deleted: false,
          createdAt: timestamp()
        })
        .then(() => {
          redirectToTargetPage()
        })
        .catch((reason: any) => {
          handleErrors({
            form: `${reason}`
          });
        })
        .then(() => loadingDone());
    } catch (error) {
      console.log(error)
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!validator.trim(values.name)) {
      errors.name = "Required";
    }

    if (!validator.trim(values.manager)) {
      errors.manager = "Required";
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

  const loadingDone = () => {
    setLoading(false);
    window.scrollTo(0, 0);
  };

  const redirectToTargetPage = () => {
    let prevPath = "/teams";
    history.push(prevPath);
  };

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <Typography
          component="h1"
          variant="h5"
          className={classes.pageTitle}
          gutterBottom
        >
          <IconButton onClick={() => history.goBack()}>
            <ArrowBackIcon />
          </IconButton>
          {"Team Add"}

          <IconButton
            className={classes.addButton}
            onClick={() => history.push("/team/add")}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Typography>
        <Box>
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
              id="manager"
              name="manager"
              type="manager"
              label={"Manager"}
              placeholder=""
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
              value={values.manager}
              onChange={handleChange}
              error={!!errors.manager}
            />
            {errors.manager && (
              <FormHelperText className={classes.formHelperText} error>
                {errors.manager}
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
      </div>
    </React.Fragment>
  );
}

export default (withRouter(TeamAdd));
