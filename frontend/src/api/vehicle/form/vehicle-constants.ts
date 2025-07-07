// Vehicle Types
export const VEHICLE_TYPES = {
  CAR: "자동차",
  TRUCK: "트럭",
  BUS: "버스",
  MOTORCYCLE: "오토바이",
  OTHER: "기타",
} as const;

export type VehicleType = keyof typeof VEHICLE_TYPES;

// Fuel Types
export const FUEL_TYPES = {
  DIESEL: "경유",
  GASOLINE: "휘발유",
  LPG: "LPG",
  ELECTRIC: "전기",
  HYBRID: "하이브리드",
  OTHER: "기타",
} as const;

export type FuelType = keyof typeof FUEL_TYPES;

// Manufacture Countries
export const MANUFACTURE_COUNTRIES = {
  KOREA: "대한민국",
  USA: "미국",
  GERMANY: "독일",
  JAPAN: "일본",
  OTHER: "기타",
} as const;

export type ManufactureCountry = keyof typeof MANUFACTURE_COUNTRIES;

// Manufacturers
export const MANUFACTURERS = {
  KIA: "기아",
  HYUNDAI: "현대",
  GENESIS: "제네시스",
  CHEVROLET: "쉐보레",
  RENAULT_KOREA: "르노코리아",
  KG_MOBILITY: "KG 모빌리티",
  OTHER: "기타",
} as const;

export type Manufacturer = keyof typeof MANUFACTURERS;

// Accident Info
export const ACCIDENT_INFO = {
  NONE: "무사고",
  TOTAL_LOSS: "전손 보험사고",
  SUBMERGED: "침수 보험사고",
  STOLEN: "도난 보험사고",
  OTHER: "기타",
} as const;

export type AccidentInfo = keyof typeof ACCIDENT_INFO;

// Repainted
export const REPAINTED_TYPES = {
  NOT_REPAINTED: "무도색",
  REPAINTED_WITH_SIMPLE: "단순도색",
  REPAINTED_WITH_BODYWORK: "판금도색",
  REPAINTED_WITH_RESTORATION: "복원도색",
  OTHER: "기타",
} as const;

export type RepaintedType = keyof typeof REPAINTED_TYPES;

// Drive Types
export const DRIVE_TYPES = {
  TWO_WD: "2WD",
  FOUR_WD: "4WD", 
  AWD: "AWD",
  FF: "FF",
  FR: "FR",
  MR: "MR",
  RMR: "RMR",
  RR: "RR",
  RWD: "RWD",
  OTHER: "기타",
} as const;

export type DriveType = keyof typeof DRIVE_TYPES;

// Transmission Types
export const TRANSMISSION_TYPES = {
  AUTOMATIC: "A/T",
  MANUAL: "M/T",
  OTHER: "기타",
} as const;

export type TransmissionType = keyof typeof TRANSMISSION_TYPES;

// Colors
export const COLORS = {
  WHITE: "화이트",
  BLACK: "블랙",
  PEARL: "펄",
  SILVER: "실버",
  GRAY: "그레이",
  CHARCOAL: "차콜",
  NAVY: "네이비",
  RED: "레드",
  YELLOW: "옐로우",
  GREEN: "그린",
  BLUE: "블루",
  LIGHT_GOLD: "라이트 골드",
  BROWN: "브라운",
  GOLD: "골드",
  SKY_BLUE: "스카이 블루",
  TURQUOISE: "터키석",
  LIGHT_GREEN: "연두",
  PINK: "핑크",
  ORANGE: "오렌지",
  OTHER: "기타",
} as const;

export type ColorType = keyof typeof COLORS;

// Special Use History
export const SPECIAL_USE_HISTORY = {
  RENTAL: "대여 용도",
  COMMERCIAL: "영업 용도",
  OFFICIAL: "관용 용도",
  OTHER: "기타",
} as const;

export type SpecialUseHistoryType = keyof typeof SPECIAL_USE_HISTORY;

// Special Modification History
export const SPECIAL_MODIFICATION_HISTORY = {
  FUEL_MODIFICATION: "연료 개조",
  SEAT_MODIFICATION: "좌석 개조",
  ENGINE_MODIFICATION: "엔진 개조",
  OTHER: "기타",
} as const;

export type SpecialModificationHistoryType = keyof typeof SPECIAL_MODIFICATION_HISTORY;

// Option Info
export const OPTION_INFO = {
  SUNROOF: "선루프",
  SIDE_STEP: "사이드스텝",
  SMART_KEY: "스마트키",
  OTHER: "기타",
} as const;

export type OptionInfoType = keyof typeof OPTION_INFO;
