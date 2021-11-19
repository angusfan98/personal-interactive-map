import ReactDOM from 'react-dom';
// import { Route } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";
import history from './utils/history';


// const ProtectedRoute = ({ component, ...args }) => (
//   <Route component={withAuthenticationRequired(component)} {...args} />
// );
const onRedirectCallback = (appState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
};

ReactDOM.render(
  <Auth0Provider
  domain="lintrollers.us.auth0.com"
  clientId="eF1vUyfArntcuLzI1qAxWVY0mBi3oY8g"
  redirectUri={window.location.origin}
  onRedirectCallback={onRedirectCallback}
>
<App />
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
