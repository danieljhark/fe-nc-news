import React, { Component } from "react";
import * as api from "../utils/api";

class VoteUpdater extends Component {
  state = {
    voteDifference: 0,
    err: false,
  };

  render() {
    const { voteDifference, err } = this.state;
    const { votes } = this.props;
    return (
      <div>
        <p>votes: {votes + voteDifference}</p>
        {err && "sorry we cannot update votes at the minute"}
        <button onClick={() => this.handleVote(1)}>
          <span role='img' aria-label='up vote'>
            👍
          </span>
        </button>
        <button onClick={() => this.handleVote(-1)}>
          <span role='img' aria-label='down vote'>
            👎
          </span>
        </button>
      </div>
    );
  }
  handleVote = (voteChange) => {
    const { article_id, type, comment_id } = this.props;

    this.setState((currentState) => {
      return {
        voteDifference: currentState.voteDifference + voteChange,
        err: false,
      };
    });
    api.patchVotes(article_id || comment_id, type, voteChange).catch(() => {
      this.setState((currentState) => {
        return {
          voteDifference: currentState.voteDifference - voteChange,
          err: true,
        };
      });
    });
  };
}

export default VoteUpdater;
