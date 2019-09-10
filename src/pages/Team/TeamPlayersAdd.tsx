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
                list.push(playerData);
            })
        );

        setTeamPlayersList(list);
        } catch (error) {
            console.log(error);
        }
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
                    list.push(data);
                })
            );
            setPlayerList(list)
        } catch(error){
            console.log(error)
        }
    }

    return(
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
                                <div>{"Info"}</div>
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </React.Fragment>
    
    )
}

export default TeamPlayersAdd;