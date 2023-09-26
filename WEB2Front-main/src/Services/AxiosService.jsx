import axios from "axios";

const createAxiosClient = (options) => {
    const client = axios.create(options);

    client.interceptors.request.use(
        (config) => {
            if(config.authorization !== false){
                const token = localStorage.getItem("token");
                if(token){
                    config.headers.authorization = `Bearer ${token}`;
                }
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return client;
}

export const axiosClient = createAxiosClient({ headers: {}});