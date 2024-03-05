import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

const token = JSON.parse(localStorage.getItem("authUser"))
  ? JSON.parse(localStorage.getItem("authUser"))
  : null;

if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
  @param {} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = token;
};

const setUrl = (path) => {
  axios.defaults.baseURL = `http://localhost:3000/api/v1`

  if (path) {
    axios.defaults.baseURL = `http://localhost:3000/api/v1`
  }
}

class APIClient {

  get = (url, params, path) => {
    let service = path || null
    setUrl(service);
    let response;
    const authToken = JSON.parse(localStorage.getItem("authUser"))
      ? JSON.parse(localStorage.getItem("authUser")).result.token
      : null;
    if (authToken) axios.defaults.headers.common["Authorization"] = "Bearer " + authToken;
    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };

  /**
   * post given data to url
   */
  create = (url, data, path) => {
    console.log("path",path);
    console.log("Url",url);
    let service = path || null
    console.log("service",service);
    setUrl(service);
    const authToken = JSON.parse(localStorage.getItem("authUser"))
      ? JSON.parse(localStorage.getItem("authUser")).result.token
      : null;
    if (authToken) axios.defaults.headers.common["Authorization"] = "Bearer " + authToken;
    return axios.post(url, data);
  };

  /**
   * Updates data
   */
  update = (url, data, path) => {
    let service = path || null
    setUrl(service);
    const authToken = JSON.parse(localStorage.getItem("authUser"))
      ? JSON.parse(localStorage.getItem("authUser")).result.token
      : null;
    if (authToken) axios.defaults.headers.common["Authorization"] = "Bearer " + authToken;
    return axios.patch(url, data);
  };

  /**
   * Delete
   */

  delete = (url, config) => {
    const authToken = JSON.parse(localStorage.getItem("authUser"))
      ? JSON.parse(localStorage.getItem("authUser")).result.token
      : null;
    if (authToken) axios.defaults.headers.common["Authorization"] = "Bearer " + authToken;
    return axios.delete(url, { ...config });
  };
}

const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
