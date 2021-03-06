import React, { Component } from "react";
import ArticleCard from "./ArticleCard";
import * as api from "../utils/api";
import Loader from "./Loader";
import ErrorDisplayer from "./ErrorDisplayer";

class Articles extends Component {
  state = {
    isLoading: true,
    articles: [],
    sortBy: "created_at",
    order: "asc",
    err: null,
    page: 1,
    maxPage: 0,
  };
  render() {
    const { topic, username } = this.props;
    const {
      articles,
      isLoading,
      sortBy,
      err,
      order,
      page,
      maxPage,
    } = this.state;
    const pageArr = [...Array(parseInt(maxPage)).keys()].map(
      (page) => page + 1
    );
    console.log(page);
    if (isLoading) return <Loader />;
    if (err) return <ErrorDisplayer msg={err} />;
    return (
      <section className='articles'>
        <h2>{topic || "all articles"}</h2>
        <form>
          <label>
            sort by:
            <select
              value={sortBy}
              name='sort by'
              onChange={(e) => this.handleChange(e.target.value)}
            >
              <option value='created_at'>date</option>
              <option value='comment_count'>comment count</option>
              <option value='votes'>votes</option>
            </select>
            <label>
              order:
              <select
                value={order}
                name='order'
                onChange={(e) => this.handleChange(sortBy, e.target.value)}
              >
                <option value='asc'>ascending</option>
                <option value='desc'>descending</option>
              </select>
            </label>
          </label>
        </form>
        {articles.map((article) => {
          return (
            <ArticleCard
              showFull={false}
              username={username}
              key={article.article_id}
              {...article}
            />
          );
        })}
        <section className='pageControl'>
          <span>
            <button
              onClick={() => this.incrementPage(-1)}
              disabled={page === 1}
            >
              Prev page
            </button>
          </span>
          <p className='darkGrey'>
            page {page} of {maxPage}
          </p>
          <span>
            <button
              onClick={() => this.incrementPage(1)}
              disabled={page === maxPage}
            >
              Next page
            </button>
          </span>
        </section>
        <section className='pageControl'>
          {pageArr.map((targetPage) => {
            return (
              <button
                value={targetPage}
                key={targetPage}
                disabled={targetPage === parseInt(page)}
                onClick={(e) => {
                  this.changePage(e.target.value);
                }}
              >
                {targetPage}
              </button>
            );
          })}
        </section>
      </section>
    );
  }
  componentDidMount() {
    this.fetchTotal();
    this.fetchArticles();
  }
  componentDidUpdate(prevProps, prevState) {
    const topicHasChanged = prevProps.topic !== this.props.topic;
    const sortByHasChanged = prevState.sortBy !== this.state.sortBy;
    const orderHasChanged = prevState.order !== this.state.order;
    const pageHasChanged = prevState.page !== this.state.page;
    if (
      topicHasChanged ||
      sortByHasChanged ||
      orderHasChanged ||
      pageHasChanged
    ) {
      this.fetchArticles();
    }
  }
  fetchTotal = () => {
    const { sortBy, order } = this.state;
    const { topic } = this.props;
    api.getArticles(sortBy, topic, order).then((articles) => {
      const maxPage = Math.ceil(articles.length / 5);
      this.setState({ maxPage });
    });
  };
  fetchArticles = () => {
    const { sortBy, order, page } = this.state;
    const { topic } = this.props;
    api
      .getArticles(sortBy, topic, order, page)
      .then((articles) => {
        this.setState({ articles, isLoading: false });
      })
      .catch(() => {
        this.setState({ err: "topic does not exist", isLoading: false });
      });
  };
  handleChange = (sortBy, order = this.state.order) => {
    this.setState({ sortBy, order });
  };

  incrementPage = (direction) => {
    this.setState(({ page }) => {
      return { page: page + direction };
    });
  };
  changePage = (page) => {
    console.log(page);
    this.setState({ page });
  };
}

export default Articles;
