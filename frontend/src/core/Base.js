import React from "react";
import Nav from "./Nav";
import "../styles.css";

const Base = ({
  title = "My Title",
  description = "My description",
  className = "bg-dark text-white p-4",
  children,
}) => (
  <div>
    <Nav />
    <div className="container-fluid">
      <div className="jumbotron bg-dark text-white text-center">
        <h2 className="display-4">{title}</h2>
        <p className="lead">{description}</p>
      </div>
      <div className={className}>{children}</div>
    </div>
    <footer className="footer my-2">
      <div className="container-fluid text-white text-center py-4">
        <h4>Reach out to us if you have any queries or feedbacks !!</h4>
        <button className="btn btn-outline-success btn-lg my-2">
          Contact Us
        </button>
      </div>
      <div className="container-fluid">
        <span className="text-muted">
          An amazing <span className="text-white">MERN</span> project
        </span>
      </div>
    </footer>
  </div>
);

export default Base;
