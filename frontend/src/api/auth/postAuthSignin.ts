"use client";

import { AxiosResponse } from "axios";
import { plainAxios } from "@/api/base/axiosInstance";
import { useAuthStore } from "@/store/auth";
import { swrCacheClear } from "@/api/base/swrCacheClear";

const path = "/api/auth/signin";

interface AuthSigninRequest {
  username: string;
  password: string;
}

export const postAuthSignin = async (
  requestBody: AuthSigninRequest
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

    // SWR 캐시 비우기
    // swrCacheClear();
  }

  return res;
};

export default postAuthSignin;
