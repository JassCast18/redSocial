import axios from './axios.js';

const API = 'http://localhost:4000/api'

export const registerRequest = user => axios.post(`/register`, user)