import React, { Component } from "react";
import * as api from "../utils/api";

class CommentAdder extends Component {
  state = { commentBody: "" };
  render() {
    const { commentBody } = this.state;
    console.log(this.props);
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          add comment:
          <input
            required
            name='commentBody'
            value={commentBody}
            onChange={this.handleChange}
          ></input>
          <button>submit</button>
        </label>
      </form>
    );
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.addComment(this.state);
  };

  addComment = ({ commentBody }) => {
    const { article_id, username, extendComments } = this.props;
    api.postComment(commentBody, article_id, username).then((comment) => {
      console.log(comment);
      extendComments(comment);
    });
  };
}

export default CommentAdder;
