import React, { useEffect, useState } from "react";
import { RouteComponentProps } from 'react-router';
import { async } from "q";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { db } from "../firebaseApp";
import { Typography, IconButton, makeStyles, Card, CardContent } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";



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
interface IProps extends RouteComponentProps<{ id: string }> { }

interface ITeam {
    id: string,
    name: string,
}

interface ITeamPlayer {
    id: string,
    playerId: string,
    teamId: string,
}

interface IPlayer {
    id: string,
    name: string
}

function TeamPlayersAdd(props: IProps) {
    const classes = useStyles();
    const { history, match } = props;
    const [teamData, setTeamData] = useState({} as ITeam);
    const [playerList, setPlayerList] = useState([] as IPlayer[])
    const [teamPlayersList, setTeamPlayersList] = useState([] as IPlayer[])

    useEffect(() => {
        getTeam();
        getTeamPlayerList()
        getPlayers();
    }, [match.params.id]);

    const getTeamPlayerList = async () => {
        try {
            const list: IPlayer[] = [];
            db
                .collection("teamPlayers")
                .where("teamId", "==", match.params.id)
                .get()
                .then(snap => {
                    snap.docs.forEach(doc => {
                        const data = doc.data() as ITeamPlayer;
                        db
                            .collection("players")
                            .doc(data.playerId)
                            .get()
                            .then(doc => {
                                const playerData = doc.data() as IPlayer;
                                playerData.id = doc.id
                                console.log(playerData)
                                list.push(playerData);
                            })
                    })
                }).then(() => {
                    console.log(list)
                    setTeamPlayersList(list);
                });
        } catch (error) {
            console.log(error);
        }
    }

    const handleCheck = (player: IPlayer) => {
        console.log(teamPlayersList, player)
        let check = true;
        teamPlayersList.forEach(item => {
            if (player.id === item.id)
                check = false
        });
        return check
    }

    const getTeam = async () => {
        try {
            const teamDoc = await db
                .collection("teams")
                .doc(match.params.id)
                .get();

            const teamData = teamDoc.data() as ITeam;
            setTeamData(teamData);
        } catch (error) {
            console.log(error);
        }
    }

    const getPlayers = async () => {
        try {
            const playersData = await db
                .collection("players")
                .get();
            const list: IPlayer[] = [];
            await Promise.all(
                playersData.docs.map(async doc => {
                    const data = doc.data() as IPlayer;
                    data.id = doc.id

                    if (!handleCheck(data))
                        list.push(data);
                })
            );
            setPlayerList(list)
        } catch (error) {
            console.log(error)
        }
    }

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
                    {"Players"}
                    <IconButton
                        className={classes.addButton}
                        onClick={() => history.push(`/team/players/add/${match.params.id}`)}
                    >
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Typography>

                {playerList.map((teamData: IPlayer, placeKey: number) => (
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

export default TeamPlayersAdd;