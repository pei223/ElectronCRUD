import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
// original
import List from './view/list';
import Form from './view/form';


const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#4527a0"
        },
        secondary: {
            main: "#4caf50"
        },
    },
    status: {
        error: red,
        danger: orange,
    },
});

const appRouting = (
    <BrowserRouter>
        <MuiThemeProvider theme={theme}>
            <AppBar position="fixed" color="primary" className="app-bar">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        Electron CRUD
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className="sidemenu">
                <p className="sidemenu-link"><Link className="sidemenu-link-text" to="/list">List</Link></p>
                <p className="sidemenu-link"><Link className="sidemenu-link-text" to="/form">New</Link></p>
            </div>
            <div className="content" style={{ paddingTop: "56px" }}>
                <Switch>
                    <Route path="/list" component={List} />
                    <Route path="/form:id" render={(props) => <Form {...props} />} />
                    <Route path="/form" component={Form} />
                    <Redirect to="/list" />
                </Switch>
            </div>
        </MuiThemeProvider>
    </BrowserRouter>
);

render(appRouting, document.getElementById("app_root"));
