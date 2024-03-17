import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

const authUserString = localStorage.getItem("authUser");
console.log("Auth User String:", authUserString);

let token = null;

if (authUserString) {
  try {
    const [, payloadBase64] = authUserString.split('.'); 
    const payloadJson = atob(payloadBase64); 
    const payload = JSON.parse(payloadJson); 

    const userEmail = payload.email;
    const userId = payload.userId;

    console.log("User Email:", userEmail);
    console.log("User ID:", userId);

    if (payload.result && payload.result.token) {
      token = payload.result.token;
    } else {
      console.warn("Invalid authUserString format: 'result' or 'token' property not found. Defaulting token to null.");
    }
  } catch (error) {
    console.error("Error parsing authUserString:", error);
  }
} else {
  console.warn("authUserString is empty. Defaulting token to null.");
}


if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}


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

const setUrl = () => {
  axios.defaults.baseURL = `http://localhost:3000/api/v1`
  console.log(axios.defaults.baseURL);
}

class APIClient {

  get = async (url) => {
    console.log("url:", url);
  
    const baseURL = axios.defaults.baseURL || 'http://localhost:3000/api/v1';
    console.log("baseURL", baseURL);

    const authToken = localStorage.getItem("authUser");
    console.log("authToken", authToken);
  
    try {
      const response = await axios.get(`${baseURL}${url}`, {
        headers: {
          Authorization: authToken ? `${authToken}` : null
        }
      });
  
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error(`Error retrieving data from ${baseURL}${url}:`, error);
      throw error;
    }
  };
  

  /**
   * post given data to url
   */
  create = async (url, data) => {
    console.log("url:", url);
  
    const baseURL = axios.defaults.baseURL || 'http://localhost:3000/api/v1';
    console.log("baseURL", baseURL);

    const authToken = localStorage.getItem("authUser");
    console.log("authToken", authToken);
  
    try {
      const response = await axios.post(`${baseURL}${url}`, data, {
        headers: {
          Authorization: authToken ? `${authToken}` : null
        }
      });
  
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error(`Error retrieving data from ${baseURL}${url}:`, error);
      throw error;
    }
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
