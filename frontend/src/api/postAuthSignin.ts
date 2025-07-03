"use client";

import { AxiosResponse } from "axios";
import { plainAxios } from "@/api/base/axiosInstance";
import { useAuthStore } from "@/store/auth";

const path = "/api/auth/signin";

interface UsersSigninRequest {
  username: string;
  password: string;
}

export const postAuthSignin = async (
  requestBody: UsersSigninRequest
): Promise<AxiosResponse> => {
  const res = await plainAxios.post(`${path}`, requestBody);

  if (res.status === 200) {
    const { accessToken, refreshToken, username, nickname } = res.data;
    
    useAuthStore.getState().signin(
      accessToken,
      refreshToken,
      username,
      nickname
    );

    // authStore.setAccessToken(accessToken);
    // authStore.setRefreshToken(refreshToken);
  }

  return res;
};

export default postAuthSignin;
