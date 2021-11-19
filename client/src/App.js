//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {Route, Switch, Router } from 'react-router-dom';
import history from './utils/history';
import Home from './components/Home';
import NaviBar from './components/NaviBar';
import MapContainer from './components/MapContainer';

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router history={history}>
      <NaviBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/map/:id" component={props => <MapContainer id={props.match.params.id}/>} />
      </Switch>
      </Router>
  );
};

export default App;
