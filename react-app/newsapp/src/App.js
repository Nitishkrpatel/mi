import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { Component } from "react";

import LoadingBar from "react-top-loading-bar";
import Navbar from "./components/Navbar";
import News from "./components/News";

export default class App extends Component {
  name = "app";
  apikey = process.env.REACT_APP_NEWS_API_KEY;
  state = {
    progress: 0
  }

  setProgress = (progress) => {
    this.setState({ progress: progress });
  }

  render() {
    return (
      <div>
        <BrowserRouter>
        <LoadingBar
            height={4}
            color="#f11946"
            progress={this.state.progress}
          />
          <Navbar />
          <Routes>
            <Route
              exact
              path="/"
              element={
                <News setProgress = {this.setProgress} apikey = {this.apikey}
                  key="general"
                  pageSize={6}
                  country={"in"}
                  category={"general"}
                />
              }
            />
            <Route
              exact
              path="/business"
              element={
                <News setProgress = {this.setProgress} apikey = {this.apikey}
                  key="business"
                  pageSize={6}
                  country={"in"}
                  category={"business"}
                />
              }
            />
            <Route
              exact
              path="/entertainment"
              element={
                <News setProgress = {this.setProgress} apikey = {this.apikey}
                  key="entertainment"
                  pageSize={6}
                  country={"in"}
                  category={"entertainment"}
                />
              }
            />
            <Route
              exact
              path="/general"
              element={
                <News setProgress = {this.setProgress} apikey = {this.apikey}
                  key="general"
                  pageSize={6}
                  country={"in"}
                  category={"general"}
                />
              }
            />
            <Route
              exact
              path="/health"
              element={
                <News setProgress = {this.setProgress} apikey = {this.apikey}
                  key="health"
                  pageSize={6}
                  country={"in"}
                  category={"health"}
                />
              }
            />
            <Route
              exact
              path="/science"
              element={
                <News setProgress = {this.setProgress} apikey = {this.apikey}
                  key="science"
                  pageSize={6}
                  country={"in"}
                  category={"science"}
                />
              }
            />
            <Route
              exact
              path="/sports"
              element={
                <News setProgress = {this.setProgress} apikey = {this.apikey}
                  key="sports"
                  pageSize={6}
                  country={"in"}
                  category={"sports"}
                />
              }
            />
            <Route
              exact
              path="/technology"
              element={
                <News setProgress = {this.setProgress} apikey = {this.apikey}
                  key="technology"
                  pageSize={6}
                  country={"in"}
                  category={"technology"}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}
