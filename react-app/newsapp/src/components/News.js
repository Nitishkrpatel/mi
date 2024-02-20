import React, { useEffect, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import PropTypes from "prop-types";
import Spinner from "./Spinner";

function News(props) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  useEffect(() => {
    document.title = `${capitalize(props.category)} - NewsMonkey`;
    fetchNews();
  });

  const capitalize = (str) => {
    if (str.length === 0) {
      return str;
    }
    return str[0].toUpperCase() + str.slice(1);
  };

  const fetchNews = async () => {
    props.setProgress(10);
    const { country, category, pageSize } = props;
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${props.apikey}&page=${page}&pageSize=${pageSize}`;

    setLoading(true);

    const response = await fetch(url);
    props.setProgress(30);
    const parsedData = await response.json();
    props.setProgress(70);

    setArticles(parsedData.articles);
    setTotalArticles(parsedData.totalResults);
    setLoading(false);

    props.setProgress(100);
  };

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    const { country, category, pageSize } = props;

    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${props.apikey}&page=${nextPage}&pageSize=${pageSize}`;

    setLoading(true);

    const response = await fetch(url);
    const parsedData = await response.json();

    setArticles(articles.concat(parsedData.articles));
    setTotalArticles(parsedData.totalResults);
    setPage(nextPage);
    setLoading(false);
  };

  return (
    <div className="my-3 text-center">
      <p>{articles.length !== totalArticles}</p>
      <h2>NewsMonkey - Top {capitalize(props.category)} Headlines</h2>
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalArticles}
        loader={loading && <Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((article) => (
              <div key={article.url} className="col-md-4">
                <NewsItem
                  title={article.title ? article.title.slice(0, 45) : ""}
                  description={
                    article.description ? article.description.slice(0, 88) : ""
                  }
                  imgUrl={article.urlToImage}
                  newsUrl={article.url}
                  author={article.author}
                  date={article.publishedAt}
                  source={article.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
}

News.defaultProps = {
  country: "in",
  pageSize: 6,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
