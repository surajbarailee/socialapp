import React, { Component } from "react";
import { signup } from "../auth/index";
import { Link } from "react-router-dom";
import SocialLogin from "./SocialLogin";

export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      open: false,
      recaptcha: false
    };
  }
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
  handleChange = name => event => {
    this.setState({ error: "" });
    this.setState({
      [name]: event.target.value
    });
  };
  clickSubmit = event => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const user = {
      name: name,
      email: email,
      password: password
    };
    // console.log(user)
    if (this.state.recaptcha) {
      signup(user).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({
            error: "",
            name: "",
            email: "",
            password: "",
            open: true
          });
        }
      });
    } else {
      this.setState({
        error: "What day is today? Please write a correct answer!"
      });
    }
  };

  signupForm = (name, email, password) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
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
        <div className="form-group">
          <label className="text-muted">
            {this.state.recaptcha
              ? "Thanks. You got it!"
              : "What day is today?"}
          </label>

          <input
            onChange={this.recaptchaHandler}
            type="text"
            className="form-control"
          />
        </div>
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised ">
        Submit
      </button>
    </form>
  );
  render() {
    return (
      <div className="container">
        <h2 className="mt-4 mb-4">Signup</h2>
        <hr />
        <SocialLogin />

        <hr />
        <div
          className="alert alert-danger"
          style={{ display: this.state.error ? "" : "none" }}
        >
          {this.state.error}
        </div>
        <div
          className="alert alert-info"
          style={{ display: this.state.open ? "" : "none" }}
        >
          New Account created .Please <Link to="/signin">Sign In !!!</Link>
        </div>

        {this.signupForm(
          this.state.name,
          this.state.email,
          this.state.password
        )}
      </div>
    );
  }
}
