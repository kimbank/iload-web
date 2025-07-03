import axios from "axios";
import useAuthStore from "@/store/auth";
import postAuthTokenRefresh from "../postAuthTokenRefresh";
import { log } from "@/lib/utils";

export const plainAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const AuthedAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 요청 인터셉터에서 동적으로 토큰 설정
AuthedAxios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AuthedAxios.interceptors.response.use(
  (response) => {
    log(`-------------------응답 인터셉터-------------------
        status:     ${JSON.stringify(response.status)}
        statusText: ${response.statusText}
        res.data:   ${JSON.stringify(response.data)}
        ${new Date()}
        -------------------------------------------------
    `);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 경우에만 토큰 리프레시 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      log("토큰 만료로 인한 재요청", originalRequest.url);

      try {
        const refreshTokenValue = useAuthStore.getState().refreshToken;
        
        if (!refreshTokenValue) {
          log("리프레시 토큰이 없음");
          useAuthStore.getState().signout();
          return Promise.reject(error);
        }

        const data = await postAuthTokenRefresh({
          refreshToken: refreshTokenValue,
        });

        if (data.accessToken && data.refreshToken) {
          useAuthStore.getState().setAccessToken(data.accessToken);
          useAuthStore.getState().setRefreshToken(data.refreshToken);

          // 새로운 토큰으로 헤더 업데이트
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          
          log("토큰 리프레시 성공, 원본 요청 재시도");
          return AuthedAxios(originalRequest);
        } else {
          log("토큰 리프레시 응답에 토큰이 없음");
          useAuthStore.getState().signout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        log("토큰 리프레시 실패", originalRequest.url);
        useAuthStore.getState().signout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const refreshToken = async () => {
  const data = await postAuthTokenRefresh({
    refreshToken: useAuthStore.getState().refreshToken,
  });

  if (data.accessToken && data.refreshToken) {
    useAuthStore.getState().setAccessToken(data.accessToken);
    useAuthStore.getState().setRefreshToken(data.refreshToken);
  }
};
