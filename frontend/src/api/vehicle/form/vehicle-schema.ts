import { z } from "zod";
import {
  VEHICLE_TYPES,
  FUEL_TYPES,
  MANUFACTURE_COUNTRIES,
  MANUFACTURERS,
  ACCIDENT_INFO,
  REPAINTED_TYPES,
  DRIVE_TYPES,
  TRANSMISSION_TYPES,
  COLORS,
  SPECIAL_USE_HISTORY,
  SPECIAL_MODIFICATION_HISTORY,
  OPTION_INFO,
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
  accidentInfo: z.array(z.string()).nullable(),
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
const manufacturerEnum = z.enum(
    Object.keys(MANUFACTURERS) as [string, ...string[]]
);

const vehicleTypeEnum = z.enum(
    Object.keys(VEHICLE_TYPES) as [string, ...string[]]
);

const fuelTypeEnum = z.enum(
    Object.keys(FUEL_TYPES) as [string, ...string[]]
);

const manufactureCountryEnum = z.enum(
    Object.keys(MANUFACTURE_COUNTRIES) as [string, ...string[]]
);

const accidentInfoEnum = z.array(z.enum(
    Object.keys(ACCIDENT_INFO) as [string, ...string[]]
));

const repaintedEnum = z.enum(
    Object.keys(REPAINTED_TYPES) as [string, ...string[]]
);

// 폼 스키마 (제출 시 validation)
export const vehicleBasicInfoFormSchema = z.object({
  // 필수 필드들
  manufacturer: manufacturerEnum.optional(),
  vehicleType: vehicleTypeEnum.optional(),
  displacement: z.number().min(1, "배기량을 입력해주세요"),
  seaterCount: z.number().min(1, "승차 인원을 입력해주세요"),
  fuelType: fuelTypeEnum,
  releasePrice: z.number().min(1, "출고가격을 입력해주세요"),
  mileage: z.number().min(0, "주행거리를 입력해주세요"),
  releaseYear: z.number()
    .min(2000, "2000년 이후의 연식을 입력해주세요")
    .max(new Date().getFullYear()+1, "미래 연식을 입력할 수 없습니다"),
  accidentInfo: accidentInfoEnum.optional(),
  repainted: repaintedEnum,
  
  // 선택 필드들
  vehicleCode: z.string().optional(),
  vehicleNumber: z.string().optional(),
  manufactureCountry: manufactureCountryEnum.optional(),
  vehicleGrade: z.string().optional(),
  manufactureYear: z.number()
    .min(2000, "2000년 이후의 제조년도를 입력해주세요")
    .max(new Date().getFullYear()+1, "미래 연식을 입력할 수 없습니다")
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
  ): string | undefined => {
    if (!value) return undefined;
    const upperValue = value.toUpperCase();
    const enumKeys = Object.keys(enumObj);
    return enumKeys.includes(upperValue) ? upperValue : undefined;
  };

  const safeNumber = (value: number | null | undefined): number | undefined => {
    return (value !== null && value !== undefined) ? value : undefined;
  };

  const safeString = (value: string | null | undefined): string | undefined => {
    return (value !== null && value !== undefined && value !== "") ? value : undefined;
  };

  const safeEnumArrayMapping = <T extends Record<string, string>>(
    values: string[] | null | undefined,
    enumObj: T
  ): string[] => {
    if (!values || !Array.isArray(values)) return [];
    const enumKeys = Object.keys(enumObj);
    return values
      .map(value => value.toUpperCase())
      .filter(value => enumKeys.includes(value));
  };

  return {
    manufacturer: safeEnumMapping(serverData.manufacturer, MANUFACTURERS) as keyof typeof MANUFACTURERS | undefined,
    vehicleType: safeEnumMapping(serverData.vehicleType, VEHICLE_TYPES) as keyof typeof VEHICLE_TYPES | undefined,
    displacement: safeNumber(serverData.displacement),
    seaterCount: safeNumber(serverData.seaterCount),
    fuelType: safeEnumMapping(serverData.fuelType, FUEL_TYPES) as keyof typeof FUEL_TYPES | undefined,
    releasePrice: safeNumber(serverData.releasePrice),
    mileage: safeNumber(serverData.mileage),
    releaseYear: safeNumber(serverData.releaseYear),
    accidentInfo: safeEnumArrayMapping(serverData.accidentInfo, ACCIDENT_INFO),
    repainted: safeEnumMapping(serverData.repainted, REPAINTED_TYPES) as keyof typeof ACCIDENT_INFO | undefined,
    vehicleCode: safeString(serverData.vehicleCode),
    vehicleNumber: safeString(serverData.vehicleNumber),
    manufactureCountry: safeEnumMapping(serverData.manufactureCountry, MANUFACTURE_COUNTRIES) as keyof typeof MANUFACTURE_COUNTRIES | undefined,
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

// Etc Info Form Schema
const driveTypeEnum = z.enum(
  Object.keys(DRIVE_TYPES) as [string, ...string[]]
);

const transmissionEnum = z.enum(
  Object.keys(TRANSMISSION_TYPES) as [string, ...string[]]
);

const colorEnum = z.enum(
  Object.keys(COLORS) as [string, ...string[]]
);

const specialUseHistoryEnum = z.enum(
  Object.keys(SPECIAL_USE_HISTORY) as [string, ...string[]]
);

const specialModificationHistoryEnum = z.enum(
  Object.keys(SPECIAL_MODIFICATION_HISTORY) as [string, ...string[]]
);

const optionInfoEnum = z.enum(
  Object.keys(OPTION_INFO) as [string, ...string[]]
);

// 폼 스키마 (제출 시 validation) - etc info
export const vehicleEtcInfoFormSchema = z.object({
  driveType: driveTypeEnum.optional(),
  transmission: transmissionEnum.optional(),
  color: colorEnum.optional(),
  initialRegistrationDate: z.string().optional(),
  specialUseHistory: specialUseHistoryEnum.optional(),
  specialModificationHistory: specialModificationHistoryEnum.optional(),
  optionInfo: optionInfoEnum.optional(),
});

// 폼 데이터 타입 (입력 중 상태 - 모든 필드 optional) - etc info
export const vehicleEtcInfoInputSchema = z.object({
  driveType: driveTypeEnum.optional(),
  transmission: transmissionEnum.optional(),
  color: colorEnum.optional(),
  initialRegistrationDate: z.string().optional(),
  specialUseHistory: specialUseHistoryEnum.optional(),
  specialModificationHistory: specialModificationHistoryEnum.optional(),
  optionInfo: optionInfoEnum.optional(),
});

export type VehicleEtcInfoFormData = z.infer<typeof vehicleEtcInfoInputSchema>;
export type VehicleEtcInfoSubmitData = z.infer<typeof vehicleEtcInfoFormSchema>;

// 서버 데이터 → 폼 데이터 변환 (타입 안전한 방식) - etc info
export function transformServerToFormEtcInfo(serverData: ServerVehicleData): VehicleEtcInfoFormData {
  // enum 값 매핑 헬퍼 함수들
  const safeEnumMapping = <T extends Record<string, string>>(
    value: string | null | undefined,
    enumObj: T
  ): string | undefined => {
    if (!value) return undefined;
    const upperValue = value.toUpperCase();
    const enumKeys = Object.keys(enumObj);
    return enumKeys.includes(upperValue) ? upperValue : undefined;
  };

  const safeString = (value: string | null | undefined): string | undefined => {
    return (value !== null && value !== undefined && value !== "") ? value : undefined;
  };

  return {
    driveType: safeEnumMapping(serverData.driveType, DRIVE_TYPES) as keyof typeof DRIVE_TYPES | undefined,
    transmission: safeEnumMapping(serverData.transmission, TRANSMISSION_TYPES) as keyof typeof TRANSMISSION_TYPES | undefined,
    color: safeEnumMapping(serverData.color, COLORS) as keyof typeof COLORS | undefined,
    initialRegistrationDate: safeString(serverData.initialRegistrationDate),
    specialUseHistory: safeEnumMapping(serverData.specialUseHistory, SPECIAL_USE_HISTORY) as keyof typeof SPECIAL_USE_HISTORY | undefined,
    specialModificationHistory: safeEnumMapping(serverData.specialModificationHistory, SPECIAL_MODIFICATION_HISTORY) as keyof typeof SPECIAL_MODIFICATION_HISTORY | undefined,
    optionInfo: safeEnumMapping(serverData.optionInfo, OPTION_INFO) as keyof typeof OPTION_INFO | undefined,
  };
}

// 폼 데이터 → API 데이터 변환 - etc info
export function transformFormToApiEtcInfo(formData: VehicleEtcInfoFormData): Partial<ServerVehicleData> {
  return {
    driveType: formData.driveType || null,
    transmission: formData.transmission || null,
    color: formData.color || null,
    initialRegistrationDate: formData.initialRegistrationDate || null,
    specialUseHistory: formData.specialUseHistory || null,
    specialModificationHistory: formData.specialModificationHistory || null,
    optionInfo: formData.optionInfo || null,
  };
}