import { AxiosResponse } from "axios";
import { AuthedAxios } from "@/api/base/axiosInstance";

const path = "/api/auth/signout";

interface AuthSignoutRequest {
  accessToken: string;
  refreshToken: string;
}

export const postAuthSignout = async (
  requestBody: AuthSignoutRequest
): Promise<AxiosResponse> => {
  const res = await AuthedAxios.post(`${path}`, requestBody);

  return res;
};

export default postAuthSignout;
