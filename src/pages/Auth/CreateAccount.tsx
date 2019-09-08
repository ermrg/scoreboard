import * as React from "react";
import { withRouter } from "react-router";
import firebase from "firebase";
import { timestamp, db } from "../firebaseApp";
import CreateAccountComponent from "./CreateAccountComponent";

function CreateAccount() {
  const handleCreateUser = async (
    currentUser: firebase.User,
    userName: string
  ) => {
    const privateData: { [field: string]: any } = {
      email: currentUser.email,
      photoURL: "",
      name: userName,
      createdAt: timestamp()
    };
    await db
      .collection("trainees")
      .doc(currentUser.uid)
      .collection("private")
      .doc("private")
      .set(privateData);
  };

  return <CreateAccountComponent handleCreateUser={handleCreateUser} />;
}

export default withRouter(CreateAccount);
