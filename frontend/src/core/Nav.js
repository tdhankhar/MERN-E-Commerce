import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/helper/index";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#2ECC72" };
  } else {
    return { color: "#FFFFFF" };
  }
};

// DOUBT: game of callbacks? if onClick is provided with a function,
// then it executes it without onClick() being called. why?
// DOUBT: why are we using callbacks in 'signout' or in 'authenticate'?
// DOUBT: why can't we just do things sequentially?
// like (call function - get result - call another function - get result)?
// DOUBT: what is this history? when and how to use it?
const Nav = ({ history }) => {
  const { user, token } = isAuthenticated();
  return (
    <div>
      <ul className="nav nav-tabs bg-dark">
        <li className="nav-item">
          <Link style={currentTab(history, "/")} className="nav-link" to="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            style={currentTab(history, "/cart")}
            className="nav-link"
            to="/cart"
          >
            Cart
          </Link>
        </li>
        {user && user.role === 0 && (
          <li className="nav-item">
            <Link
              style={currentTab(history, "/user/dashboard")}
              className="nav-link"
              to="/user/dashboard"
            >
              User
            </Link>
          </li>
        )}
        {user && user.role === 1 && (
          <li className="nav-item">
            <Link
              style={currentTab(history, "/admin/dashboard")}
              className="nav-link"
              to="/admin/dashboard"
            >
              Admin
            </Link>
          </li>
        )}
        {!user && (
          <Fragment>
            <li className="nav-item">
              <Link
                style={currentTab(history, "/signup")}
                className="nav-link"
                to="/signup"
              >
                Sign-Up
              </Link>
            </li>
            <li className="nav-item">
              <Link
                style={currentTab(history, "/signin")}
                className="nav-link"
                to="/signin"
              >
                Sign-In
              </Link>
            </li>
          </Fragment>
        )}
        {user && (
          <li className="nav-item">
            <Link
              style={currentTab(history, "/signout")}
              className="nav-link"
              to="#"
              onClick={() => {
                signout(token, () => {
                  history.push("/");
                });
              }}
            >
              Sign-Out
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Nav);
