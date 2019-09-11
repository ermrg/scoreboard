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
}

interface IPlayer {
    id?: string;
    name: string;
}

interface ITeamPlayer {
    id: string;
    teamId: string;
    playerId: string;
}
interface IProps extends RouteComponentProps<{ id: string }> { }


function TeamPlayers(props: IProps) {
    const { history, match } = props;
    const [teamPlayerList, setTeamPlayerList] = useState([] as IPlayer[])
    const [team, setTeam] = useState({} as ITeam)
    const classes = useStyles();
    useEffect(() => {
        getTeam();
        getPlayerList();
    }, [match.params.id]);

    const getTeam = async () => {
        const teamDoc = await db
            .collection("teams")
            .doc(match.params.id)
            .get()
        const teamData = teamDoc.data() as ITeam;
        setTeam(teamData)
    }

    const getPlayerList = async () => {

        const teamPlayers = await db
            .collection("teamPlayers")
            .where("teamId", "==", match.params.id)
            .get();

        const list: IPlayer[] = [];
        await Promise.all(
            teamPlayers.docs.map(async doc => {
                const data = doc.data() as ITeamPlayer;

                const playerDoc = await db
                    .collection("players")
                    .doc(data.playerId)
                    .get()
                const playerData = playerDoc.data() as IPlayer;
                playerData.id = playerDoc.id
                list.push(playerData);
            })
        );

        setTeamPlayerList(list);
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
                    {"Team"} : {team.name}
                    <IconButton
                        className={classes.addButton}
                        onClick={() => history.push(`/team/players/add/${match.params.id}`)}
                    >
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Typography>

                {teamPlayerList.map((teamData: IPlayer, placeKey: number) => (
                    <Card
                        className={classes.card}
                        key={placeKey}
                        onClick={() => history.push(`/player/detail/${teamData.id}`)}
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
                                <div>{teamData.id}</div>
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </React.Fragment>
    )
}

export default TeamPlayers;