import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useVehicle } from "@/api/vehicle/useVehicle";
import { putVehicleBasicInfo } from "@/api/vehicle/putVehicleBasicInfo";
import {
  VehicleBasicInfoFormData,
  vehicleBasicInfoInputSchema,
  transformServerToForm,
  transformFormToApi,
  serverVehicleSchema,
} from "@/api/vehicle/form/vehicle-schema";
import {
  getDefaultFormValues,
  validateFormSubmission,
  setFormErrors,
  checkRequiredFields,
  logFormState,
} from "@/api/vehicle/form/form-utils";

/**
 * 차량 기본정보 폼을 위한 커스텀 훅
 */
export const useVehicleBasicInfoForm = (vehicleId: number | null) => {
  const router = useRouter();
  const { data: vehicleData, isLoading, mutate } = useVehicle(vehicleId || 0);

  // React Hook Form 설정
  const form = useForm<VehicleBasicInfoFormData>({
    resolver: zodResolver(vehicleBasicInfoInputSchema),
    mode: "onChange", // 실시간 validation
    defaultValues: getDefaultFormValues(),
  });

  // 서버 데이터로 폼 초기화
  useEffect(() => {
    if (vehicleData && !isLoading && vehicleId) {
      try {
        // 서버 데이터 validation
        const validatedServerData = serverVehicleSchema.parse(vehicleData);
        
        // 타입 안전한 변환
        const formData = transformServerToForm(validatedServerData);
        
        console.log("🔍 Server data received:", vehicleData);
        console.log("🔍 Transformed form data:", formData);
        
        logFormState(formData, "Server data loaded");
        
        // 폼 reset - 명시적으로 각 필드 설정
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined) {
            form.setValue(key as keyof VehicleBasicInfoFormData, value);
          }
        });
        
        // 추가로 form.reset도 호출
        form.reset(formData);
        
        console.log("✅ Form initialized with server data");
      } catch (error) {
        console.error("❌ Failed to parse server data:", error);
        // 서버 데이터가 잘못된 경우 기본값으로 초기화
        form.reset(getDefaultFormValues());
      }
    }
  }, [vehicleData, isLoading, vehicleId, form]);

  // 폼 제출 핸들러
  const handleSubmit = async (data: VehicleBasicInfoFormData) => {
    if (!vehicleId) {
      console.error("❌ Vehicle ID is required");
      return;
    }

    logFormState(data, "Form submission");

    // 제출 전 validation
    const validation = validateFormSubmission(data);
    
    if (!validation.success) {
      console.error("❌ Validation failed:", validation.fieldErrors);
      setFormErrors(form, validation.fieldErrors);
      return;
    }

    try {
      // API 데이터 변환
      const apiData = transformFormToApi(validation.data);
      
      console.log("🚀 Sending API data:", apiData);
      
      // API 호출
      await putVehicleBasicInfo(vehicleId, apiData as any);
      
      // 성공 시 다음 페이지로 이동
      router.push(`/register/etc-info?id=${vehicleId}`);
      
      console.log("✅ Form submitted successfully");
    } catch (error) {
      console.error("❌ Failed to update basic info:", error);
      // 에러 처리 (필요에 따라 toast 메시지 등)
    } finally {
      // 캐시 업데이트
      mutate();
    }
  };

  // 현재 폼 상태
  const formState = form.watch();
  const isFormValid = checkRequiredFields(formState);
  const isDirty = form.formState.isDirty;

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isLoading,
    isFormValid,
    isDirty,
    formState,
  };
};
