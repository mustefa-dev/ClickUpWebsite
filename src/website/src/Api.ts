import axios, { AxiosError } from "axios";
import { AuthStore } from "@/utils/authStore";
import { decodeJwt } from "jose";

const URL = import.meta.env.PROD ? "/api/" : import.meta.env.VITE_BASE_URL || "http://localhost:5194";

export const ApiConf = {
    url: URL,
};

const ACCESS_TOKEN = AuthStore.getAccessToken();

const Api = axios.create({
    baseURL: URL,
    headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
});

Api.interceptors.request.use(
    async (config) => {
        const accessToken = AuthStore.getAccessToken();
        if (accessToken) {
            try {
                const timestampInUTC = new Date(new Date().toUTCString()).getTime();
                const exp = decodeJwt(accessToken).exp * 1000;
                if (exp <= timestampInUTC) {
                    const response = await axios.post(`${URL}/auth/refresh`, {
                        refreshToken: AuthStore.State.getState().userInfo.refreshToken,
                    });
                    AuthStore.onLogin(response.data);
                }
            } catch (err) {
                console.log(`error: ${err}`);
                if (err.code === "ERR_JWT_INVALID" || err.response.status === 401 || err.response.data === "Invalid refresh token") {
                    AuthStore.onLogout();
                    return;
                }
            }
        } else {
            AuthStore.onLogout();
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

Api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        return Promise.reject(error);
    }
);
const ApiNoAuth = axios.create({ baseURL: URL });

export { Api, ApiNoAuth };
