import React, { useEffect, useState } from "react";
import firebase from "../firebaseApp";

type ContextProps = {
  loadingAuthState: boolean;
  user: firebase.User | null;
  setUser: any;
  uid: string;
  authenticated: boolean;
};

export const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null as firebase.User | null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      setLoadingAuthState(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loadingAuthState,
        user,
        setUser,
        uid: user ? user.uid : "",
        authenticated: user !== null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
