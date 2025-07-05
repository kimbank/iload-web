import { AxiosResponse } from "axios";
import { AuthedAxios } from "@/api/base/axiosInstance";
import { swrCacheClear } from "@/api/base/swrCacheClear";

const path = "/api/auth/signout";

interface AuthSignoutRequest {
  accessToken: string;
  refreshToken: string;
}

export const postAuthSignout = async (
  requestBody: AuthSignoutRequest
): Promise<AxiosResponse> => {
  const res = await AuthedAxios.post(`${path}`, requestBody);
  
  // SWR 캐시 비우기
  swrCacheClear();

  return res;
};

export default postAuthSignout;
