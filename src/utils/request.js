import axios from "axios";

const instance = axios.create({
    baseURL: `http://${process.env.VUE_APP_IP}:3000/`,
    timeout: 1000 * 10,
});

instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
