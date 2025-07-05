import { AxiosResponse } from "axios";
import { AuthedAxios } from "@/api/base/axiosInstance";

const path = "/api/vehicle/create-empty";

export const postCreateEmpty = async (): Promise<AxiosResponse<number>> => {
  const res = await AuthedAxios.post(path);

  return res;
};

export default postCreateEmpty;
