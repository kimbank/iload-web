import { z } from "zod";
import {
  VEHICLE_TYPES,
  FUEL_TYPES,
  MANUFACTURE_COUNTRIES,
  MANUFACTURERS,
  ACCIDENT_INFO,
  REPAINTED_TYPES,
} from "@/api/vehicle/form/vehicle-constants";

// 서버 응답과 클라이언트 폼 간의 타입 변환을 위한 스키마
export const serverVehicleSchema = z.object({
  id: z.number(),
  manufacturer: z.string().nullable(),
  vehicleType: z.string().nullable(),
  displacement: z.number().nullable(),
  seaterCount: z.number().nullable(),
  fuelType: z.string().nullable(),
  vehicleCode: z.string().nullable(),
  vehicleNumber: z.string().nullable(),
  manufactureCountry: z.string().nullable(),
  vehicleGrade: z.string().nullable(),
  releasePrice: z.number().nullable(),
  mileage: z.number().nullable(),
  releaseYear: z.number().nullable(),
  manufactureYear: z.number().nullable(),
  accidentInfo: z.string().nullable(),
  repainted: z.string().nullable(),
  // 추가 서버 필드들
  driveType: z.string().nullable().optional(),
  transmission: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  initialRegistrationDate: z.string().nullable().optional(),
  specialUseHistory: z.string().nullable().optional(),
  specialModificationHistory: z.string().nullable().optional(),
  optionInfo: z.string().nullable().optional(),
  sellingPrice: z.number().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ServerVehicleData = z.infer<typeof serverVehicleSchema>;

// 폼 스키마 - 필수 필드와 선택 필드를 명확히 구분
const manufacturerEnum = z.enum([
  MANUFACTURERS.KIA,
  MANUFACTURERS.HYUNDAI,
  MANUFACTURERS.GENESIS,
  MANUFACTURERS.CHEVROLET,
  MANUFACTURERS.RENAULT_KOREA,
  MANUFACTURERS.KG_MOBILITY,
  MANUFACTURERS.OTHER,
]);

const vehicleTypeEnum = z.enum([
  VEHICLE_TYPES.CAR,
  VEHICLE_TYPES.TRUCK,
  VEHICLE_TYPES.BUS,
  VEHICLE_TYPES.MOTORCYCLE,
  VEHICLE_TYPES.OTHER,
]);

const fuelTypeEnum = z.enum([
  FUEL_TYPES.DIESEL,
  FUEL_TYPES.GASOLINE,
  FUEL_TYPES.LPG,
  FUEL_TYPES.ELECTRIC,
  FUEL_TYPES.HYBRID,
  FUEL_TYPES.OTHER,
]);

const manufactureCountryEnum = z.enum([
  MANUFACTURE_COUNTRIES.KOREA,
  MANUFACTURE_COUNTRIES.USA,
  MANUFACTURE_COUNTRIES.GERMANY,
  MANUFACTURE_COUNTRIES.JAPAN,
  MANUFACTURE_COUNTRIES.OTHER,
]);

const accidentInfoEnum = z.enum([
  ACCIDENT_INFO.TOTAL_LOSS,
  ACCIDENT_INFO.SUBMERGED,
  ACCIDENT_INFO.STOLEN,
  ACCIDENT_INFO.OTHER,
]);

const repaintedEnum = z.enum([
  REPAINTED_TYPES.NOT_REPAINTED,
  REPAINTED_TYPES.REPAINTED_WITH_SIMPLE,
  REPAINTED_TYPES.REPAINTED_WITH_BODYWORK,
  REPAINTED_TYPES.REPAINTED_WITH_RESTORATION,
  REPAINTED_TYPES.OTHER,
]);

// 폼 스키마 (제출 시 validation)
export const vehicleBasicInfoFormSchema = z.object({
  // 필수 필드들
  manufacturer: manufacturerEnum,
  vehicleType: vehicleTypeEnum.optional(),
  displacement: z.number().min(1, "배기량을 입력해주세요"),
  seaterCount: z.number().min(1, "승차 인원을 입력해주세요"),
  fuelType: fuelTypeEnum,
  releasePrice: z.number().min(1, "출고가격을 입력해주세요"),
  mileage: z.number().min(0, "주행거리를 입력해주세요"),
  releaseYear: z.number()
    .min(1900, "올바른 연식을 입력해주세요")
    .max(new Date().getFullYear(), "올바른 연식을 입력해주세요"),
  accidentInfo: accidentInfoEnum,
  repainted: repaintedEnum,
  
  // 선택 필드들
  vehicleCode: z.string().optional(),
  vehicleNumber: z.string().optional(),
  manufactureCountry: manufactureCountryEnum.optional(),
  vehicleGrade: z.string().optional(),
  manufactureYear: z.number()
    .min(1900, "올바른 제조년도를 입력해주세요")
    .max(new Date().getFullYear(), "올바른 제조년도를 입력해주세요")
    .optional(),
});

// 폼 데이터 타입 (입력 중 상태 - 모든 필드 optional)
export const vehicleBasicInfoInputSchema = z.object({
  manufacturer: manufacturerEnum.optional(),
  vehicleType: vehicleTypeEnum.optional(),
  displacement: z.number().optional(),
  seaterCount: z.number().optional(),
  fuelType: fuelTypeEnum.optional(),
  releasePrice: z.number().optional(),
  mileage: z.number().optional(),
  releaseYear: z.number().optional(),
  accidentInfo: accidentInfoEnum.optional(),
  repainted: repaintedEnum.optional(),
  vehicleCode: z.string().optional(),
  vehicleNumber: z.string().optional(),
  manufactureCountry: manufactureCountryEnum.optional(),
  vehicleGrade: z.string().optional(),
  manufactureYear: z.number().optional(),
});

export type VehicleBasicInfoFormData = z.infer<typeof vehicleBasicInfoInputSchema>;
export type VehicleBasicInfoSubmitData = z.infer<typeof vehicleBasicInfoFormSchema>;

// 서버 데이터 → 폼 데이터 변환 (타입 안전한 방식)
export function transformServerToForm(serverData: ServerVehicleData): VehicleBasicInfoFormData {
  // enum 값 매핑 헬퍼 함수들
  const safeEnumMapping = <T extends Record<string, string>>(
    value: string | null | undefined,
    enumObj: T
  ): T[keyof T] | undefined => {
    if (!value) return undefined;
    const upperValue = value.toUpperCase();
    const enumValues = Object.values(enumObj) as string[];
    return enumValues.includes(upperValue) ? (upperValue as T[keyof T]) : undefined;
  };

  const safeNumber = (value: number | null | undefined): number | undefined => {
    return value !== null && value !== undefined ? value : undefined;
  };

  const safeString = (value: string | null | undefined): string | undefined => {
    return value !== null && value !== undefined && value !== "" ? value : undefined;
  };

  return {
    manufacturer: safeEnumMapping(serverData.manufacturer, MANUFACTURERS),
    vehicleType: safeEnumMapping(serverData.vehicleType, VEHICLE_TYPES),
    displacement: safeNumber(serverData.displacement),
    seaterCount: safeNumber(serverData.seaterCount),
    fuelType: safeEnumMapping(serverData.fuelType, FUEL_TYPES),
    releasePrice: safeNumber(serverData.releasePrice),
    mileage: safeNumber(serverData.mileage),
    releaseYear: safeNumber(serverData.releaseYear),
    accidentInfo: safeEnumMapping(serverData.accidentInfo, ACCIDENT_INFO),
    repainted: safeEnumMapping(serverData.repainted, REPAINTED_TYPES),
    vehicleCode: safeString(serverData.vehicleCode),
    vehicleNumber: safeString(serverData.vehicleNumber),
    manufactureCountry: safeEnumMapping(serverData.manufactureCountry, MANUFACTURE_COUNTRIES),
    vehicleGrade: safeString(serverData.vehicleGrade),
    manufactureYear: safeNumber(serverData.manufactureYear),
  };
}

// 폼 데이터 → API 데이터 변환
export function transformFormToApi(formData: VehicleBasicInfoFormData): Partial<ServerVehicleData> {
  return {
    manufacturer: formData.manufacturer || null,
    vehicleType: formData.vehicleType || null,
    displacement: formData.displacement || null,
    seaterCount: formData.seaterCount || null,
    fuelType: formData.fuelType || null,
    releasePrice: formData.releasePrice || null,
    mileage: formData.mileage || null,
    releaseYear: formData.releaseYear || null,
    accidentInfo: formData.accidentInfo || null,
    repainted: formData.repainted || null,
    vehicleCode: formData.vehicleCode || null,
    vehicleNumber: formData.vehicleNumber || null,
    manufactureCountry: formData.manufactureCountry || null,
    vehicleGrade: formData.vehicleGrade || null,
    manufactureYear: formData.manufactureYear || null,
  };
}