import axios from "axios";

const API_URL = 'http://localhost:8000/api/v1/auth/';

interface User {
    email: string;
    password: string;
}

export const loginn = (user: User) => axios.post(`${API_URL}signin`, user);