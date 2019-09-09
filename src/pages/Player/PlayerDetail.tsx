import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import firebase, { timestamp, db } from "../firebaseApp";
import moment from "moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import defaultProfilePhoto from "../../assets/images/default_profile_photo.png";
import Button from "@material-ui/core/Button";
import classNames from "classnames";
import Chip from "@material-ui/core/Chip";
moment.locale("ja");

const useStyles = makeStyles({
    wrapper: {
        padding: 16
    },
    card: {
        minWidth: 275,
        cursor: "pointer",
        marginBottom: 20
    },
    pageTitle: {
        position: "relative"
    },
    addButton: {
        position: "absolute",
        right: 0,
        top: "-8px"
    },
    photo: {
        width: 80,
        height: 80
    },
    profileCard: {
        display: "flex",
        alignItems: "center"
    },
    profileCardInfo: {
        marginLeft: 10,
        flex: 1,
        display: "flex",
        justifyContent: "space-between"
    },
    profileCardName: {
        fontSize: "1.5rem",
        fontWeight: "bolder"
    },
    profileCardWork: {
        color: "#9B9B9B"
    },
    tabs: {
        marginTop: 20,
        display: "flex",
        justifyContent: "center",
        border: "1px solid #61B1F3",
        borderRadius: 20,
        maxWidth: 500,
        margin: "0 auto 20px auto"
    },
    tab: {
        fontWeight: "bold",
        color: "#61B1F3",
        width: "80%",
        borderRadius: 20,
        "&:hover": {
            background: "#61B1F3",
            color: "#fff"
        }
    },
    tabLeft: {
        borderRadius: "20px 0 0 20px"
    },
    tabCenter: {
        borderRadius: "0",
        borderLeft: "1px solid #61B1F3",
        borderRight: "1px solid #61B1F3"
    },
    tabRight: {
        borderRadius: "0 20px 20px 0"
    },
    activeTab: {
        background: "#61B1F3",
        color: "#fff"
    },
    cancelChip: {
        marginLeft: 10
    }
});

interface IPlayer {
    name: string,
    height: string,
    deleted?: boolean
}

interface Props extends RouteComponentProps<{ id: string }> { }

function Customer(props: Props) {
    const classes = useStyles();

    const { history, match } = props;
    const [profileData, setProfileData] = useState({} as IPlayer);
    const [selectedTab, setSelectedTab] = useState(1);

    useEffect(() => {
        getPlayerProfile();
    }, [match.params.id]);

    const getPlayerProfile = async () => {
        const customerDoc = await db
            .collection("players")
            .doc(match.params.id)
            .get();
        if (customerDoc.exists) {
            setProfileData(customerDoc.data() as IPlayer);
        }
    };
    const changeTab = (tabIndex: number) => {
        setSelectedTab(tabIndex);
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
                    {"Player details"}
                </Typography>

                {profileData.name && (
                    <React.Fragment>
                        <div className={classes.profileCard}>
                            <Avatar
                                alt={profileData.name}
                                src={defaultProfilePhoto}
                                className={classes.photo}
                            />
                            <div className={classes.profileCardInfo}>
                                <div>
                                    <div className={classes.profileCardName}>
                                        {profileData.name}
                                        {!!profileData.name && profileData.deleted && (
                                            <Chip
                                                label={"Deleted"}
                                                size="small"
                                                color="secondary"
                                                className={classes.cancelChip}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        disabled={!!profileData.name && profileData.deleted}
                                        onClick={() =>
                                            history.push(`/player/edit/${match.params.id}`)
                                        }
                                    >
                                        {"Edit"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className={classes.tabs}>
                            <Button
                                className={classNames(
                                    classes.tab,
                                    classes.tabLeft,
                                    selectedTab === 1 && classes.activeTab
                                )}
                                onClick={() => changeTab(1)}
                            >
                                {"Profile"}
                            </Button>
                            <Button
                                className={classNames(
                                    classes.tab,
                                    classes.tabCenter,
                                    selectedTab === 2 && classes.activeTab
                                )}
                                onClick={() => changeTab(2)}
                            >
                                {"Statistic"}
                            </Button>
                            <Button
                                className={classNames(
                                    classes.tab,
                                    classes.tabRight,
                                    selectedTab === 3 && classes.activeTab
                                )}
                                onClick={() => changeTab(3)}
                            >
                                {"History"}
                            </Button>
                        </div>

                        {selectedTab === 1 && (
                            <List disablePadding={true}>
                                <ListItem disableGutters={true}>
                                    <ListItemText
                                        primary={"Email"}
                                        secondary={profileData.name}
                                    />
                                </ListItem>
                            </List>
                        )}

                        {selectedTab === 2 && (
                            <List disablePadding={true}>
                                <ListItem disableGutters={true}>
                                    <ListItemText
                                        primary={"Height"}
                                        secondary={
                                            profileData.height
                                                ? `${profileData.height}cm`
                                                : "Blank"
                                        }
                                    />
                                </ListItem>
                            </List>
                        )}
                    </React.Fragment>
                )}

                {selectedTab === 3 && (
                    <div>
                        Was good, is better, going to be best </div>
                )}
            </div>
        </React.Fragment>
    );
}
export default (withRouter(Customer));
