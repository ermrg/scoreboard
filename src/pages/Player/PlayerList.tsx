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

interface IPlayer {
    id?: string;
    name: string;
    height: string;
}
interface IProps extends RouteComponentProps { }


function PlayerList(props: IProps) {
    const { history } = props;
    const [playerList, setPlayerList] = useState([] as IPlayer[])
    const classes = useStyles();
    useEffect(() => {
        getProfileList();
    }, []);

    const getProfileList = async () => {
        const spanShot = await db
            .collection("players")
            .get();
        const list: IPlayer[] = [];
        spanShot.docs.forEach(doc => {
            const data = doc.data() as IPlayer;
            data.id = doc.id;
            list.push(data);
        });
        setPlayerList(list);
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
                    {"Players"}
                    <IconButton
          className={classes.addButton}
          onClick={() => history.push("/player/add")}
        >
          <AddCircleOutlineIcon />
        </IconButton>
                </Typography>

                {playerList.map((playerData: IPlayer, placeKey: number) => (
                    <Card
                        className={classes.card}
                        key={placeKey}
                        onClick={() => history.push(`/player/detail/${playerData.id}`)}
                    >
                        
                        <CardContent className={"placeContent"}>
                            <Typography
                                variant="h5"
                                component="h2"
                                className={classes.placeName}
                            >
                                {playerData.name}
                            </Typography>
                            <Typography component="div" className={classes.placeAddress}>
                                <div>{`${playerData.height}`}</div>
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </React.Fragment>
    )
}

export default PlayerList;