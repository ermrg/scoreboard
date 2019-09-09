import * as Sentry from "@sentry/browser";
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import validator from "validator";
import firebase, { db, timestamp } from '../firebaseApp';
import { async } from 'q';
import { makeStyles } from '@material-ui/styles';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { Typography, IconButton, Box, TextField, FormHelperText, FormControl, Button, CircularProgress, Grid, Theme } from '@material-ui/core';
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        padding: 16
    },
    pageTitle: {
        position: "relative"
    },
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
}));
interface ITeamData {
    id?: string;
    name: string;
    manager: string;
}
interface FormErrors extends ITeamData {
    form: string;
}
interface IProps extends RouteComponentProps<{ id: string }> { }

function TeamEdit(props: IProps) {
    const classes = useStyles();
    const { history, match, location } = props;
    const [teamData, setTeamData] = useState({} as ITeamData)
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({} as FormErrors);
    const [values, setValues] = useState({
        name: "",
        manager: ""
    });

    useEffect(() => {
        getTeamData();
    }, []);

    const getTeamData = async () => {
        try {
            const doc = await db
                .collection('teams')
                .doc(match.params.id)
                .get();
            const data = doc.data() as ITeamData;
            data.id = doc.id;
            setTeamData(data);
            setValues(data);

        } catch (error) {
            console.log("Error occured", error)
        }
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        updateTeam();
    };


    const handleChange = (event: any) => {
        event.persist();
        setValues(values => ({
            ...values,
            [event.target.name]: event.target.value
        }));
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

    const redirectToTargetPage = () => {
        let prevPath = `/team/detail/${match.params.id}`;
        const storagePrePath = sessionStorage.getItem("prevPath");
        if (storagePrePath) {
            prevPath = storagePrePath;
            sessionStorage.removeItem("prevPath");
        } else if (location.state && location.state.prevPath) {
            prevPath = location.state.prevPath;
        }
        history.push(prevPath);
    };

    const updateTeam = () => {
        try {
            db.collection("teams")
                .doc(teamData.id)
                .set(
                    {
                        name: values.name,
                        manager: values.manager,
                        updatedAt: timestamp()
                    },
                    { merge: true }
                )
                .catch((reason: any) => {
                    Sentry.captureMessage(
                        `TrainingMenu Update Error: ${JSON.stringify(reason)}`,
                        Sentry.Severity.Fatal
                    );
                    handleErrors({
                        form: `メニューの更新に失敗しました。お手数をおかけしますが、しばらくしてから再度お試しください。${reason}`
                    });
                })
                .then(() => {
                    redirectToTargetPage()
                    setLoading(false)
                });
        } catch (error) {
            console.log("Error occured", error)
        }
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
                    {"Team Edit"}
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
                                        {"Update"}
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
    )
}

export default TeamEdit;