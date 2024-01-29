import React from 'react';
import { Route} from 'react-router-dom';
import { useAuth } from './AuthContext';
import NotFound from '../../view/NotFound';



const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isLoggedIn } = useAuth();
  
    return (
      <Route
        {...rest}
        render={(props) => (isLoggedIn ? <Component {...props} /> : <NotFound />)}
      />
    );
  };
  
  export default PrivateRoute;