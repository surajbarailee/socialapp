import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Menu from "./core/Menu";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import FindPeople from "./user/FindPeople";
import SinglePost from "./post/SinglePost";
import PrivateRouter from "./auth/PrivateRoute";
import NewPost from "./post/NewPost";
import EditPost from "./post/EditPost";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
// import SinglePost from "./post/SinglePost";

const MainRouter = () => (
  <div>
    <Menu />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route
        exact
        path="/reset-password/:resetPasswordToken"
        component={ResetPassword}
      />
      <PrivateRouter exact path="/post/create" component={NewPost} />
      <Route exact path="/post/:postId" component={SinglePost} />
      <PrivateRouter exact path="/post/edit/:postId" component={EditPost} />

      <Route exact path="/users" component={Users} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signin" component={Signin} />
      <PrivateRouter exact path="/user/edit/:userId" component={EditProfile} />
      <PrivateRouter exact path="/findpeople" component={FindPeople} />

      <PrivateRouter exact path="/user/:userId" component={Profile} />
    </Switch>
  </div>
);

export default MainRouter;
