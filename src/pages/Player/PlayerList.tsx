import React, { useState, useEffect } from 'react';
import firebase, { timestamp, db } from "../firebaseApp";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Card, makeStyles, CardContent, Typography, IconButton } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
const useStyles = makeStyles({
    wrapper: {
        padding: 16
    },
    pageHeading: {
        borderBottom: "1px solid #bbb",
        position: "relative",
        boxShadow: "0px 0px 3px #bbb",
        padding: "6px 10px 0px 10px",
        height: "40px",
    },
    pageHeadingTitle:{

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
    pageTitle: {
        position: "relative"
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
    const [playerList, setPlayerList] = useState([] as IPlayer[])
    const classes = useStyles();
    const { history } = props;
    useEffect(() => {
        getProfileList();
    }, []);

    const getProfileList = async () => {
        const spanShot = await db
            .collection("players")
            //   .orderBy("order")
            //   .orderBy("createdAt")
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
            <div className={classes.pageHeading}>
                <Typography
                    variant="h5"
                    component="h2"
                    className={classes.pageHeadingTitle}>
                    Players
                </Typography>

                <IconButton
                    className={classes.addButton}
                    onClick={() => history.push("/player/add")}
                >
                    <AddCircleOutlineIcon />
                </IconButton>
            </div>

            {playerList.map((playerData: IPlayer, placeKey: number) => (
                <Card
                    className={classes.card}
                    key={placeKey}
                    onClick={() => history.push(`/place/edit/${playerData.id}`)}
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
        </React.Fragment>
    )
}

export default PlayerList;