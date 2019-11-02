import React, { Component } from "react";
import { isAuthenticated } from "../auth"; //for the token
import { deletion } from "./apiUser";
import { signout } from "../auth/index";
import { Redirect } from "react-router-dom";

export default class DeleteUser extends Component {
  state = {
    redirect: false
  };
  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    deletion(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        ////signout user and redirect
        signout(() => console.log("User is deleted"));
        this.setState({ redirect: true });
      }
    });
  };
  deletion = () => {
    let ok = window.confirm("We hope you are Sure to delete account..!!");
    if (ok) {
      this.deleteAccount();
    }
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <button onClick={this.deletion} className="btn btn-raised btn-danger">
        Delete Profile
      </button>
    );
  }
}
