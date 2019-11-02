import React, { Component } from "react";
import { signup } from "../auth/index";

export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      open: false
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
    const { name, email, password } = this.state;
    const user = {
      name: name,
      email: email,
      password: password
    };
    // console.log(user)
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
          New Account created .Please Sign In !!!
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
