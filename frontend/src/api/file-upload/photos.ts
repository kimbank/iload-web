import { AuthedAxios } from "@/api/base/axiosInstance";
import { AxiosResponse } from "axios";
import { components } from "@/api/openapi-schema";

const path = "/api/file/photos";

export type VehiclePhotoResponse = components["schemas"]["RegisteredVehicleFileSummaryResponse"];

// 차량 사진 업로드
export const uploadVehiclePhoto = async (
  vehicleId: number,
  file: File
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await AuthedAxios.post(`${path}?vehicleId=${vehicleId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res;
};

// 차량 사진 삭제
export const deleteVehiclePhoto = async (
  photoId: number
): Promise<AxiosResponse> => {
  const res = await AuthedAxios.delete(`${path}?photoId=${photoId}`);

  return res;
};

export default {
  uploadVehiclePhoto,
  deleteVehiclePhoto,
};
