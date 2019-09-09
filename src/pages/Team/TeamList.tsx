import React, { useState, useEffect } from 'react';
import { db } from "../firebaseApp";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Card, makeStyles, CardContent, Typography, IconButton } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';

const useStyles = makeStyles({
    wrapper: {
        padding: 16
    },
    pageTitle: {
        position: "relative"
    },
    card: {
        minWidth: 275,
        maxWidth: 543,
        cursor: "pointer",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        color: "black",
        borderRadius: 8,
        margin: "15px auto",
        "& .placeContent": {
            padding: 20
        }
    },
    addButton: {
        position: "absolute",
        right: "5px",
        bottom: 0
    },
    placeName: {
        fontWeight: "bolder",
        marginBottom: 10
    },
    placeAddress: {
        display: "flex",
        justifyContent: "space-between",
        fontWeight: "bolder"
    }
});

interface ITeam {
    id?: string;
    name: string;
    manager: string;
}
interface IProps extends RouteComponentProps { }


function TeamList(props: IProps) {
    const { history } = props;
    const [teamList, setTeamList] = useState([] as ITeam[])
    const classes = useStyles();
    useEffect(() => {
        getProfileList();
    }, []);

    const getProfileList = async () => {
        const spanShot = await db
            .collection("teams")
            .get();
        const list: ITeam[] = [];
        spanShot.docs.forEach(doc => {
            const data = doc.data() as ITeam;
            data.id = doc.id;
            list.push(data);
        });
        setTeamList(list);
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
                    {"Teams"}
                    <IconButton
          className={classes.addButton}
          onClick={() => history.push("/team/add")}
        >
          <AddCircleOutlineIcon />
        </IconButton>
                </Typography>

                {teamList.map((teamData: ITeam, placeKey: number) => (
                    <Card
                        className={classes.card}
                        key={placeKey}
                        onClick={() => history.push(`/team/detail/${teamData.id}`)}
                    >
                        
                        <CardContent className={"placeContent"}>
                            <Typography
                                variant="h5"
                                component="h2"
                                className={classes.placeName}
                            >
                                {teamData.name}
                            </Typography>
                            <Typography component="div" className={classes.placeAddress}>
                                <div>{`${teamData.manager}`}</div>
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </React.Fragment>
    )
}

export default TeamList;