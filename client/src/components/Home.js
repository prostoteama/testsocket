import React, { Component } from "react";
import WebsocketModule from "./websocketModule";
// import axios from "axios";
import "./Home.css";

class Home extends Component {
  componentDidMount() {
	WebsocketModule()
  }
  render() {
    return (
      <div className="container">
        <header className="header">
          <div className="logo-container">
            <h1 className="logo-text">
              Doge<span className="logo-highlight">ller</span>
            </h1>
          </div>
        </header>
        <div className="content-container">
          <div className="active-users-panel" id="active-user-container">
            <h3 className="panel-title">Active Users:</h3>
          </div>
          <div className="video-chat-container">
            <h2 className="talk-info" id="talking-with-info">
              Select active user on the left menu.
            </h2>
            <div className="video-container">
              <video
                autoPlay
                className="remote-video"
                id="remote-video"
              ></video>
              <video
                autoPlay
                muted
                className="local-video"
                id="local-video"
              ></video>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
