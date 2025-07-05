import { AxiosResponse } from "axios";
import { AuthedAxios } from "@/api/base/axiosInstance";

const path = "/api/vehicle/etc-info";

type DriveType =
  | "TWO_WD"
  | "FOUR_WD"
  | "AWD"
  | "FF"
  | "FR"
  | "MR"
  | "RMR"
  | "RR"
  | "RWD"
  | "OTHER";

type Transmission = "AUTOMATIC" | "MANUAL" | "OTHER";

type Color =
  | "WHITE"
  | "BLACK"
  | "PEARL"
  | "SILVER"
  | "GRAY"
  | "CHARCOAL"
  | "NAVY"
  | "RED"
  | "YELLOW"
  | "GREEN"
  | "BLUE"
  | "LIGHT_GOLD"
  | "BROWN"
  | "GOLD"
  | "SKY_BLUE"
  | "TURQUOISE"
  | "LIGHT_GREEN"
  | "PINK"
  | "ORANGE"
  | "OTHER";

type SpecialUseHistory = "RENTAL" | "COMMERCIAL" | "OFFICIAL" | "OTHER";

type SpecialModificationHistory =
  | "FUEL_MODIFICATION"
  | "SEAT_MODIFICATION"
  | "ENGINE_MODIFICATION"
  | "OTHER";

type OptionInfo = "SUNROOF" | "SIDE_STEP" | "SMART_KEY" | "OTHER";

export interface VehicleRegistrationEtcInfoRequest {
  driveType: DriveType;
  transmission: Transmission;
  color: Color;
  initialRegistrationDate: string | null | undefined; // or Date
  specialUseHistory: SpecialUseHistory;
  specialModificationHistory: SpecialModificationHistory;
  optionInfo: OptionInfo;
}

export const putVehicleEtcInfo = async (
  id: number,
  requestBody: VehicleRegistrationEtcInfoRequest
): Promise<AxiosResponse> => {
  const res = await AuthedAxios.put(`${path}?id=${id}`, requestBody);

  return res;
};

export default putVehicleEtcInfo;
