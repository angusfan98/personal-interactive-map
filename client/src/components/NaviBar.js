import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import{Button} from 'react-bootstrap'
import { useAuth0 } from "@auth0/auth0-react";

const NaviBar = () => {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });
    if (isAuthenticated) {
        return (
            <div id="nav_bar">
            <nav className="navbar navbar-dark navbar-expand-lg fixed-top shadow-lg bg-dark "><a id="lint_roller_text_nav" href="/" className="navbar-brand">LintRollers</a>
            <button type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler"><span className="navbar-toggler-icon"></span></button>
            <div id="navbarSupportedContent" className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item"><Button href={"/map/" + user.email.replace(/[ ,.]/g, "")}>Map</Button></li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item" id="res"></li>
                </ul> 
                <ul className="navbar-nav ml-auto">
                    <li id="welcome_back"className="nav-item">Welcome back {user.name}</li>
                </ul> 
            <div className="navbar-text ml-lg-3">
            <Button id='logoutbutton' onClick={logoutWithRedirect}>Log out</Button>
            </div>
            </div>
            </nav>
            </div>
        )
    }
    else {
        return (
            <div id="nav_bar">
            <nav className="navbar navbar-dark navbar-expand-lg fixed-top shadow-sm bg-dark"><a id="lint_roller_text_nav" href="index.html" className="navbar-brand">LintRollers</a>
            <button type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler"><span className="navbar-toggler-icon"></span></button>
            <div id="navbarSupportedContent" className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
                    <li className="nav-item"><Button onClick={loginWithRedirect}>Map</Button></li>
                </ul>
            <ul className="navbar-nav ml-auto">
                <li id="welcome_back" className="nav-item">Welcome Guest</li>
            </ul> 
            <div className="navbar-text ml-lg-3">
            <Button onClick={loginWithRedirect}>Log in</Button>
            </div>
            </div>
            </nav>
            </div>
        );
    }  
};

export default NaviBar;