import { AxiosResponse } from "axios";
import { plainAxios } from "@/api/base/axiosInstance";

const path = "/api/auth/token-refresh";

interface AuthTokenRefreshRequest {
  refreshToken: string;
}

interface AuthTokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const postAuthTokenRefresh = async (
  requestBody: AuthTokenRefreshRequest
): Promise<AuthTokenRefreshResponse> => {
  const res: AxiosResponse<AuthTokenRefreshResponse> = await plainAxios.post(
    `${path}`,
    {
      ...requestBody,
    }
  );

  return res.data;
};

export default postAuthTokenRefresh;
