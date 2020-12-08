import { API } from "../../backend";

// DOUBT: how this 'then' and 'catch' works?
// DOUBT: shouldn't we return the err in 'catch' so that we can catch it in SignUp.js?
// DOUBT: here we are returning response and because it is a successful return that is why
// we could catch it in 'then' of SignUp.js. How does this chaining works?
// DOUBT: if we return something from 'catch', then will it go to 'catch' or 'then'?
// DOUBT: what kind of errors go in 'catch'?
// DOUBT: what kidn of errors go in 'then' as backend response even though it is an error?
export const signup = (user) => {
  return fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const signin = (user) => {
  return fetch(`${API}/auth/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

// DOUBT: what is next? and why is it used?
// DOUBT: how is jwt coming here?
// DOUBT: are we storing the JWT tokens in cookies from the backend or this localStorage?
// DOUBT: if both then what is the difference?
export const authenticate = (data, next) => {
  if (typeof window !== undefined) {
    localStorage.setItem("login_credentials", JSON.stringify(data));
    next();
  }
};

export const isAuthenticated = () => {
  if (typeof window == undefined) {
    return false;
  }
  if (localStorage.getItem("login_credentials")) {
    return JSON.parse(localStorage.getItem("login_credentials"));
  } else {
    return false;
  }
};

export const signout = (token, next) => {
  if (typeof window !== undefined) {
    localStorage.removeItem("login_credentials");
    next();

    return fetch(`${API}/auth/signout`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
