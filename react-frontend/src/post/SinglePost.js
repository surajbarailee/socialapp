import React, { Component } from "react";
import { singlePost, remove } from "./apiPost";
import DefaultPost from "../images/default.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/index";

export default class SinglePost extends Component {
  state = {
    post: "",
    redirect: false
  };
  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ post: data });
      }
    });
  };
  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirect: true });
      }
    });
  };
  deletionConfirmed = () => {
    let ok = window.confirm("We hope you are Sure to delete account..!!");
    if (ok) {
      this.deletePost();
    }
  };
  renderPost = post => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : "Anynomous";

    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          alt={post.title}
          onError={i => (i.target.src = `${DefaultPost}`)}
          className="img-thumbnail mb-3"
          style={{ height: "400px", width: "100%", objectFit: "cover" }}
        />

        <p className="card-text">{post.body}</p>
        <br />
        <p className="font-italic mark">
          Posted by:<Link to={`${posterId}`}>{posterName}</Link>
          {"  "}On{new Date(post.created).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">
            Back to post
          </Link>

          {isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy._id && (
              <>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised btn-warning btn-sm mr-5"
                >
                  Update Post
                </Link>
                <button
                  onClick={this.deletionConfirmed}
                  className="btn btn-raised btn-danger"
                >
                  Delete Post
                </button>
              </>
            )}
        </div>
      </div>
    );
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to={"/"} />;
    }
    const { post } = this.state;
    return (
      <div className="container">
        <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
        {!post ? (
          <div className="jumbotron text-center">
            <h3>Loading...</h3>
          </div>
        ) : (
          this.renderPost(post)
        )}
      </div>
    );
  }
}
