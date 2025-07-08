import { AxiosResponse } from "axios";
import { AuthedAxios } from "@/api/base/axiosInstance";
import { ServerVehicleData } from "@/api/price/form/scratch-schema";

const path = "/api/price/scratch";

// API 요청 타입 (서버 스키마 기반)
export type PriceScratchRequest = Partial<Pick<ServerVehicleData,
  | 'manufacturer' // 제조사
  | 'vehicleType' // 차량 종류
  | 'displacement' // 배기량
  | 'seaterCount' // 좌석 수
  | 'fuelType' // 연료 종류
  | 'releasePrice' // 출시 가격
  | 'mileage' // 주행 거리
  | 'releaseYear' // 출시 연도
  | 'manufactureYear' // 제조 연도
  | 'accidentInfo' // 사고 이력
  | 'repainted' // 재도색 여부
>>;

export const postPriceScratch = async (
  requestBody: PriceScratchRequest
): Promise<AxiosResponse> => {
  const res = await AuthedAxios.post(`${path}`, requestBody);

  return res;
};

export default postPriceScratch;
