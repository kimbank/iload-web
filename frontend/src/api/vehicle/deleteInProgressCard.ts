import { AxiosResponse } from "axios";
import { AuthedAxios } from "@/api/base/axiosInstance";

const path = "/api/vehicle/in-progress-card";

export const deleteInProgressCard = async (
  id: number
): Promise<AxiosResponse<number>> => {
  const res = await AuthedAxios.delete(path, {
    params: { id },
  });

  return res;
};

export default deleteInProgressCard;
