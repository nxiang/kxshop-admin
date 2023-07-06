import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Authorized from './Authorized';

// TODO: umi只会返回render和rest
const AuthorizedRoute = ({ component: Component, render, authority, redirectPath, ...rest }) => (
  <Authorized
    authority={authority}
    noMatch={<Route {...rest} render={() => <Navigate to={{ pathname: redirectPath }} />} />}
  >
    <Route {...rest} render={props => (Component ? <Component {...props} /> : render(props))} />
  </Authorized>
);

export default AuthorizedRoute;
