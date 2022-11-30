import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './App.css';
import Login from './components/Login';
import RegisterUser from './components/RegisterUser';
import Menu from './components/Menu';
import OrdersUser from './components/OrdersUser';
import PageNotFound from './components/PageNotFound';
import AccessDenied from './components/AccessDenied';
import PrivateRoute from './PrivateRoute';
import AddDish from './components/AddDish';
import ViewCart from './components/ViewCart';
import UserProfile from './components/UserProfiles';
import Transactions from './components/Transactions';
import MenuRating from './components/MenuRating';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Redirect exact from="/" to="/login" />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={RegisterUser} />
          <Route exact path="/menu" component={Menu} />
          <Route path="/transactions" component={Transactions} />
          <Route
            path="/Profile"
            exact
            render={() => (
              <PrivateRoute component={UserProfile} action="User_profile" />
            )}
          />
          <Route
            path="/Menu/rating"
            exact
            render={() => (
              <PrivateRoute component={MenuRating} action="menu_rating" />
            )}
          />
          <Route
            path="/user/orders"
            exact
            render={() => (
              <PrivateRoute component={OrdersUser} action="user_user_orders" />
            )}
          />
          <Route
            path="/add_dish"
            exact
            render={() => (
              <PrivateRoute component={AddDish} action="add_dish" />
            )}
          />
          <Route
            path="/view_cart"
            exact
            render={() => (
              <PrivateRoute component={ViewCart} action="view_cart" />
            )}
          />
          <Route path="/access_denied" exact component={AccessDenied} />
          <Route path="*" exact={true} component={PageNotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
