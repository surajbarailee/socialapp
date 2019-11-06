import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import { DefaultPost } from "../images/default.jpg";

export default class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      body: "",
      redirect: false,
      error: ""
    };
  }
  init = postId => {
    singlePost(postId).then(data => {
      if (data.error) {
        this.setState({ redirect: true });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: "",
          fileSize: 0,
          loading: false
        });
      }
    });
  };

  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({
      [name]: value,
      fileSize
    });
  };
  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 100000) {
      this.setState({ error: "FileSize should be less than 100kb" });
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "Title and Body is required", loading: false });
      return false;
    }
    return true;
  };
  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.isValid()) {
      // const { name, email, password } = this.state;
      const postId = this.state.id;
      const token = isAuthenticated().token;

      update(postId, token, this.postData).then(data => {
        if (data.error) {
          console.log(data.error, "Errorrororo");
          this.setState({ error: data.error });
        } else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            // photo: "",
            redirect: true
          });
        }
      });
    }
  };
  editPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Post Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          className="form-control"
          accept="image/*"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Body</label>
        <textarea
          onChange={this.handleChange("body")}
          type="text"
          className="form-control"
          value={body}
        />
      </div>

      <button onClick={this.clickSubmit} className="btn btn-raised ">
        Update Post
      </button>
    </form>
  );

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }
  render() {
    const { title, body, redirect, id, error, loading } = this.state;
    if (redirect) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{title}</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}
        <img
          src={`${
            process.env.REACT_APP_API_URL
          }/post/photo/${id}?${new Date().getTime()}`}
          alt={title}
          style={{ height: "200px", width: "auto" }}
          className="img-thunbnail"
          onError={i => (i.target.src = `${DefaultPost}`)}
        />
        {this.editPostForm(title, body)}
      </div>
    );
  }
}
