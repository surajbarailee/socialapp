import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import SocialLogin from "./SocialLogin";

import { signin, authenticate } from "../auth/index";

export default class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToReferer: false,
      loading: false,
      recaptcha: false
    };
  }
  handleChange = name => event => {
    this.setState({ error: "" });
    this.setState({
      [name]: event.target.value
    });
  };
  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email: email,
      password: password
    };
    if (this.state.recaptcha) {
      signin(user).then(data => {
        console.log(data);
        //if error data contains error else the data has json web token
        if (data.error) {
          this.setState({ error: data.error, loading: false });
        } else {
          //authenticate user
          //redirect
          authenticate(data, () => {
            this.setState({ redirectToReferer: true });
          });
        }
      });
    } else {
      this.setState({
        loading: false,
        error:
          "What day is today? Please write a correct answer in a format (sunday or monday or tuesday etc)!"
      });
    }
  };
  recaptchaHandler = e => {
    this.setState({ error: "" });
    let userDay = e.target.value.toLowerCase();
    let dayCount;

    if (userDay === "sunday") {
      dayCount = 0;
    } else if (userDay === "monday") {
      dayCount = 1;
    } else if (userDay === "tuesday") {
      dayCount = 2;
    } else if (userDay === "wednesday") {
      dayCount = 3;
    } else if (userDay === "thursday") {
      dayCount = 4;
    } else if (userDay === "friday") {
      dayCount = 5;
    } else if (userDay === "saturday") {
      dayCount = 6;
    }

    if (dayCount === new Date().getDay()) {
      this.setState({ recaptcha: true });
      return true;
    } else {
      this.setState({
        recaptcha: false
      });
      return false;
    }
  };

  signinForm = (email, password) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={this.handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">
          {this.state.recaptcha ? "Thanks. You got it!" : "What day is today?"}
        </label>

        <input
          onChange={this.recaptchaHandler}
          type="text"
          className="form-control"
        />
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised ">
        Login
      </button>
    </form>
  );
  render() {
    if (this.state.redirectToReferer) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <h2 className="mt-4 mb-4">SignIn</h2>
        <div
          className="alert alert-danger"
          style={{ display: this.state.error ? "" : "none" }}
        >
          {this.state.error}
        </div>
        {this.state.loading ? (
          <div className="jumbotron text-center">
            <h3>Loading...</h3>
          </div>
        ) : (
          ""
        )}

        {this.signinForm(
          this.state.email,
          this.state.password,
          this.state.recaptcha
        )}

        <p>
          <Link to="/forgot-password" className="text-danger">
            {" "}
            Forgot Password
          </Link>
          <hr />
          <SocialLogin />
        </p>
      </div>
    );
  }
}
