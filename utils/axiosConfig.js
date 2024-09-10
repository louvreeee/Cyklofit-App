// axiosConfig.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://your-flask-server-url.com',
  timeout: 10000, // Adjust timeout as per your requirements
  headers: {
    'Content-Type': 'application/json',
    // Add any other default headers here
  },
});

export default instance;
