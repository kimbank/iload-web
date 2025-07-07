import { AuthedAxios } from "@/api/base/axiosInstance";
import { AxiosResponse } from "axios";
import { components } from "@/api/openapi-schema";

const path = "/api/file/certificates";

export type VehicleRegistrationCertificateResponse = components["schemas"]["RegisteredVehicleFileSummaryResponse"];

// 차량 등록증 업로드
export const uploadVehicleRegistrationCertificate = async (
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

// 차량 등록증 삭제
export const deleteVehicleRegistrationCertificate = async (
  certificateId: number
): Promise<AxiosResponse> => {
  const res = await AuthedAxios.delete(`${path}?certificateId=${certificateId}`);

  return res;
};

export default {
  uploadVehicleRegistrationCertificate,
  deleteVehicleRegistrationCertificate,
};
