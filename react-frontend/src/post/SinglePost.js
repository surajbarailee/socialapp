import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import DefaultPost from "../images/default.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/index";
import Comment from "./Comment";

export default class SinglePost extends Component {
  state = {
    post: "",
    redirect: false,
    redirectSignin: false,
    like: false,
    likes: 0,
    comments: []
  };
  checkLike = likes => {
    if (!isAuthenticated()) {
      this.setState({ redirectSignin: true });
      return false;
    }
    const userId = isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };
  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
        });
      }
      console.log(data, "Component did Mount");
    });
  };
  updateComments = comments => {
    this.setState({ comments });
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
  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectSignin: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;
    callApi(userId, token, postId).then(data => {
      if (data.error) {
        console.log(data.eror);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length
        });
      }
    });
  };
  renderPost = post => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : "Anynomous";
    const { like, likes } = this.state;

    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          alt={post.title}
          onError={i => (i.target.src = `${DefaultPost}`)}
          className="img-thumbnail mb-3"
          style={{ height: "400px", width: "100%", objectFit: "cover" }}
        />
        {like ? (
          <h3>
            <i
              onClick={this.likeToggle}
              className="fas fa-thumbs-up text-success"
            ></i>{" "}
            {likes} like
          </h3>
        ) : (
          <h3>
            <i onClick={this.likeToggle} class="fas fa-thumbs-up"></i> {likes}{" "}
            like
          </h3>
        )}

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
    const { post, redirect, redirectSignin, comments } = this.state;
    if (redirect) {
      return <Redirect to={"/"} />;
    }
    if (redirectSignin) {
      return <Redirect to={"/signin"} />;
    }
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

        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}
