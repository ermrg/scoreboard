import React from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home';
import PlayerAdd from './pages/Player/PlayerAdd';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router, Link, Switch } from 'react-router-dom';
import Header from './pages/layouts/Header';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { AuthProvider } from './pages/Auth/AuthProvider';
import PrivateRoute from './pages/Auth/PrivateRoute';
import Auth from './pages/Auth/Auth';
import CreateAccount from './pages/Auth/CreateAccount';
import Login from './pages/Auth/Login';
import PlayerList from './pages/Player/PlayerList';
import PlayerDetail from './pages/Player/PlayerDetail';
import PlayerEdit from './pages/Player/PlayerEdit';
import TeamList from './pages/Team/TeamList';
import TeamAdd from './pages/Team/TeamAdd';
import TeamDetail from './pages/Team/TeamDetail';
import TeamEdit from './pages/Team/TeamEdit';
import TeamPlayers from './pages/Team/TeamPlayers';

const theme = createMuiTheme({
    palette: {
        background: {
            default: "#ffffff"
        },
        primary: {
            main: "#558CED"
        }
    }
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Router>
            <AuthProvider>
                <Header />
                <div style={{ marginTop: "64px" }}>
                    <Switch>
                        <Route exact path="/auth" component={Auth} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/create-account" component={CreateAccount} />
                        <Route exact path="/" component={Home} />

                        {/*  Players */}
                        <PrivateRoute exact path="/players" component={PlayerList} />
                        <PrivateRoute exact path="/player/add" component={PlayerAdd} />
                        <PrivateRoute exact path="/player/detail/:id" component={PlayerDetail} />
                        <PrivateRoute exact path="/player/edit/:id" component={PlayerEdit} />

                        {/*  Teams */}
                        <PrivateRoute exact path="/teams" component={TeamList} />
                        <PrivateRoute exact path="/team/add" component={TeamAdd} />
                        <PrivateRoute exact path="/team/detail/:id" component={TeamDetail} />
                        <PrivateRoute exact path="/team/edit/:id" component={TeamEdit} />
                        <PrivateRoute exact path="/team/players/:id" component={TeamPlayers} />
                    </Switch>
                </div>
            </AuthProvider>
        </Router>
    </MuiThemeProvider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
