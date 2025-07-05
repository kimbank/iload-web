import { AxiosResponse } from "axios";
import { AuthedAxios } from "@/api/base/axiosInstance";

const path = "/api/users/signup";

interface UsersSignupRequest {
  username: string;
  password: string;
}

export const postUsersSignup = async (
  requestBody: UsersSignupRequest
): Promise<AxiosResponse> => {
  const res = await AuthedAxios.post(`${path}`, {
    ...requestBody,
  })
    .then((res) => res)
    .catch((err) => err.response);

  return res;
};

export default postUsersSignup;
