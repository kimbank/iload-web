import { UseFormReturn } from "react-hook-form";
import { VehicleBasicInfoFormData, vehicleBasicInfoFormSchema, VehicleBasicInfoSubmitData } from "./vehicle-schema";

/**
 * SOTA 폼 관리를 위한 유틸리티
 * - TypeScript 타입 안전성 보장
 * - Zod를 통한 런타임 validation
 * - React Hook Form 최적화
 */

// 폼 기본값 (초기 상태)
export const getDefaultFormValues = (): VehicleBasicInfoFormData => ({
  manufacturer: undefined,
  vehicleType: undefined,
  displacement: undefined,
  seaterCount: undefined,
  fuelType: undefined,
  vehicleCode: "",
  vehicleNumber: "",
  manufactureCountry: undefined,
  vehicleGrade: "",
  releasePrice: undefined,
  mileage: undefined,
  releaseYear: undefined,
  manufactureYear: undefined,
  accidentInfo: undefined,
  repainted: undefined,
});

// 폼 제출 시 validation
export const validateFormSubmission = (data: VehicleBasicInfoFormData): {
  success: true;
  data: VehicleBasicInfoSubmitData;
} | {
  success: false;
  error: string;
  fieldErrors: Record<string, string>;
} => {
  try {
    const validatedData = vehicleBasicInfoFormSchema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error: any) {
    const fieldErrors: Record<string, string> = {};
    
    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path && err.path.length > 0) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
    }
    
    return {
      success: false,
      error: "입력한 정보를 확인해주세요",
      fieldErrors,
    };
  }
};

// 폼 에러 설정 헬퍼
export const setFormErrors = (
  form: UseFormReturn<VehicleBasicInfoFormData>,
  fieldErrors: Record<string, string>
) => {
  Object.entries(fieldErrors).forEach(([field, message]) => {
    form.setError(field as keyof VehicleBasicInfoFormData, {
      type: "manual",
      message,
    });
  });
};

// 필수 필드 체크 (UI 비활성화 등에 사용)
export const checkRequiredFields = (data: VehicleBasicInfoFormData): boolean => {
  const requiredFields = [
    'manufacturer',
    'displacement', 
    'seaterCount',
    'fuelType',
    'releasePrice',
    'mileage',
    'releaseYear',
    'accidentInfo',
    'repainted'
  ] as const;

  return requiredFields.every(field => {
    const value = data[field];
    if (typeof value === 'number') {
      return value > 0;
    }
    return value !== undefined && value !== null;
  });
};

// 폼 상태 로깅 (개발용)
export const logFormState = (
  formData: VehicleBasicInfoFormData,
  context: string = "Form State"
) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 [${context}] Form data:`, formData);
    console.log(`🔍 [${context}] Required fields satisfied:`, checkRequiredFields(formData));
  }
};
