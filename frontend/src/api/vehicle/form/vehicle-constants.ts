// Vehicle Types
export const VEHICLE_TYPES = {
  CAR: "CAR",
  TRUCK: "TRUCK", 
  BUS: "BUS",
  MOTORCYCLE: "MOTORCYCLE",
  OTHER: "OTHER",
} as const;

export type VehicleType = keyof typeof VEHICLE_TYPES;

// Fuel Types
export const FUEL_TYPES = {
  DIESEL: "DIESEL",
  GASOLINE: "GASOLINE",
  LPG: "LPG",
  ELECTRIC: "ELECTRIC",
  HYBRID: "HYBRID",
  OTHER: "OTHER",
} as const;

export type FuelType = keyof typeof FUEL_TYPES;

// Manufacture Countries
export const MANUFACTURE_COUNTRIES = {
  KOREA: "KOREA",
  USA: "USA",
  GERMANY: "GERMANY",
  JAPAN: "JAPAN",
  OTHER: "OTHER",
} as const;

export type ManufactureCountry = keyof typeof MANUFACTURE_COUNTRIES;

// Manufacturers
export const MANUFACTURERS = {
  KIA: "KIA",
  HYUNDAI: "HYUNDAI",
  GENESIS: "GENESIS",
  CHEVROLET: "CHEVROLET",
  RENAULT_KOREA: "RENAULT_KOREA",
  KG_MOBILITY: "KG_MOBILITY",
  OTHER: "OTHER",
} as const;

export type Manufacturer = keyof typeof MANUFACTURERS;

// Accident Info
export const ACCIDENT_INFO = {
  TOTAL_LOSS: "TOTAL_LOSS",
  SUBMERGED: "SUBMERGED", 
  STOLEN: "STOLEN",
  OTHER: "OTHER",
} as const;

export type AccidentInfo = keyof typeof ACCIDENT_INFO;

// Repainted
export const REPAINTED_TYPES = {
  NOT_REPAINTED: "NOT_REPAINTED",
  REPAINTED_WITH_SIMPLE: "REPAINTED_WITH_SIMPLE",
  REPAINTED_WITH_BODYWORK: "REPAINTED_WITH_BODYWORK", 
  REPAINTED_WITH_RESTORATION: "REPAINTED_WITH_RESTORATION",
  OTHER: "OTHER",
} as const;

export type RepaintedType = keyof typeof REPAINTED_TYPES;

// Display labels for UI
export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  CAR: "자동차",
  TRUCK: "트럭",
  BUS: "버스", 
  MOTORCYCLE: "오토바이",
  OTHER: "기타",
};

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  DIESEL: "디젤",
  GASOLINE: "가솔린",
  LPG: "LPG",
  ELECTRIC: "전기",
  HYBRID: "하이브리드",
  OTHER: "기타",
};

export const MANUFACTURE_COUNTRY_LABELS: Record<ManufactureCountry, string> = {
  KOREA: "한국",
  USA: "미국", 
  GERMANY: "독일",
  JAPAN: "일본",
  OTHER: "기타",
};

export const MANUFACTURER_LABELS: Record<Manufacturer, string> = {
  KIA: "기아",
  HYUNDAI: "현대",
  GENESIS: "제네시스",
  CHEVROLET: "쉐보레",
  RENAULT_KOREA: "르노코리아",
  KG_MOBILITY: "KG모빌리티",
  OTHER: "기타",
};

export const ACCIDENT_INFO_LABELS: Record<AccidentInfo, string> = {
  TOTAL_LOSS: "전손 보험사고",
  SUBMERGED: "침수 보험사고",
  STOLEN: "도난 보험사고", 
  OTHER: "기타",
};

export const REPAINTED_TYPE_LABELS: Record<RepaintedType, string> = {
  NOT_REPAINTED: "무도색",
  REPAINTED_WITH_SIMPLE: "단순도색",
  REPAINTED_WITH_BODYWORK: "판금도색",
  REPAINTED_WITH_RESTORATION: "복원도색",
  OTHER: "기타",
};
