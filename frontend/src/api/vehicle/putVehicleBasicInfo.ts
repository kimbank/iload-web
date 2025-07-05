import { AxiosResponse } from "axios";
import { AuthedAxios } from "@/api/base/axiosInstance";
import { ServerVehicleData } from "@/api/vehicle/form/vehicle-schema";

const path = "/api/vehicle/basic-info";

// API 요청 타입 (서버 스키마 기반)
export type VehicleRegistrationBasicInfoRequest = Partial<Pick<ServerVehicleData, 
  | 'manufacturer'
  | 'vehicleType' 
  | 'displacement'
  | 'seaterCount'
  | 'fuelType'
  | 'vehicleCode'
  | 'vehicleNumber'
  | 'manufactureCountry'
  | 'vehicleGrade'
  | 'releasePrice'
  | 'mileage'
  | 'releaseYear'
  | 'manufactureYear'
  | 'accidentInfo'
  | 'repainted'
>>;

export const putVehicleBasicInfo = async (
  id: number,
  requestBody: VehicleRegistrationBasicInfoRequest
): Promise<AxiosResponse> => {
  const res = await AuthedAxios.put(`${path}?id=${id}`, requestBody);

  return res;
};

export default putVehicleBasicInfo;
