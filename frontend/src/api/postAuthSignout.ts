import { AxiosResponse } from "axios";
import { AuthedAxios } from "@/api/base/axiosInstance";

const path = "/api/auth/signout";

interface UsersSignupRequest {
  accessToken: string;
  refreshToken: string;
}

export const postUsersSignout = async (
  requestBody: UsersSignupRequest
): Promise<AxiosResponse> => {
  const res = await AuthedAxios.post(`${path}`, requestBody);

  return res;
};

export default postUsersSignout;
