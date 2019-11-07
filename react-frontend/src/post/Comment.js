import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth/index";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";
export default class Comment extends Component {
  state = {
    text: "",
    error: ""
  };
  handleChange = event => {
    this.setState({ error: "" });
    this.setState({ text: event.target.value });
  };
  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 200) {
      this.setState({
        error: "Comment should not be empty and less than 200 characters long"
      });
      return false;
    }
    return true;
  };
  addComment = e => {
    e.preventDefault();
    if (!isAuthenticated()) {
      this.setState({ error: "Please sign in to continue" });
      return false;
    }
    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text }).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          //so user dont have to refreah after creating a comment we are going to do this
          this.props.updateComments(data.comments);
        }
      });
    }
  };
  deleteComment = comment => {
    const userId = isAuthenticated().user._id;
    const postId = this.props.postId;
    const token = isAuthenticated().token;

    uncomment(userId, token, postId, comment).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  };

  deletionConfirmed = comment => {
    let ok = window.confirm("We hope you are Sure to delete comment..!!");
    if (ok) {
      this.deleteComment(comment);
    }
  };
  errorimage(e) {
    e.onError = null;
    e.target.src = DefaultProfile;
  }

  render() {
    const { comments } = this.props;
    const { error } = this.state;

    return (
      <div>
        <h2 className="mt-5 mb-5">Leave a comment</h2>
        <form onSubmit={this.addComment}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              onChange={this.handleChange}
              value={this.state.text}
              placeholder="Leave a comment.."
            />
            <button className="btn btn-raised btn-success mt-2">Post</button>
          </div>
        </form>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div className="col-md-8 col-md-12">
          <h3 className="text-primary">{comments.length} Comments</h3>
          <hr />
          {comments.map((comment, i) => (
            <div key={i}>
              <div>
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img
                    onError={this.errorimage}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                    style={{
                      borderRadius: "50%",
                      border: "1px solid black"
                    }}
                    className="float-left mr-2"
                    height="40px"
                    width="40px"
                    alt={comment.postedBy.name}
                  />
                </Link>
                <div>
                  <p className="lead">{comment.text}</p>

                  <p className="font-italic mark">
                    Posted by:
                    <Link to={`${comment.postedBy._id}`}>
                      {comment.postedBy.name}{" "}
                    </Link>
                    {"  "}On{new Date(comment.created).toDateString()}
                    <span>
                      {isAuthenticated().user &&
                        isAuthenticated().user._id === comment.postedBy._id && (
                          <>
                            <span
                              onClick={() => this.deletionConfirmed(comment)}
                              className="text-danger float-right mr-1"
                            >
                              Remove
                            </span>
                          </>
                        )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
//onError={i => (i.target.src = `${DefaultProfile}`)}
