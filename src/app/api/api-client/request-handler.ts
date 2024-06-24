import { type InternalAxiosRequestConfig } from "axios";
import { type Session } from "next-auth";


const requestHandler = (config:InternalAxiosRequestConfig) => {
  {
    const lsUserSession = localStorage.getItem("_user_session");
    if (lsUserSession) {
      const user_session = JSON.parse(lsUserSession) as Session;
      config.headers.Authorization = `Bearer ${user_session.accessToken}`;
    }
    return config;
  }
}

export default requestHandler;