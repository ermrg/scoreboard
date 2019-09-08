import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import config from "./config";

firebase.initializeApp(config.firebase);

firebase.auth().languageCode = "ja";

export const db = firebase.firestore();

export const timestamp = () => {
  return firebase.firestore.FieldValue.serverTimestamp();
};

export default firebase;
