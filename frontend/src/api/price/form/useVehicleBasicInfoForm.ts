import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { log } from "@/lib/utils";
import { postPriceScratch } from "@/api/price/form/postPriceScratch";
import {
  VehicleScratchFormData,
  vehicleScratchInputSchema,
  transformServerToForm,
  transformFormToApi,
  serverVehicleSchema,
} from "@/api/price/form/scratch-schema";
import {
  getDefaultFormValues,
  validateFormSubmission,
  setFormErrors,
  checkRequiredFields,
  logFormState,
} from "@/api/price/form/form-utils";

export const useVehicleBasicInfoForm = () => {
  const router = useRouter();

  // React Hook Form 설정
  const form = useForm<VehicleScratchFormData>({
    resolver: zodResolver(vehicleScratchInputSchema),
    mode: "onChange", // 실시간 validation
    defaultValues: getDefaultFormValues(),
  });

  // 폼 제출 핸들러
  const handleSubmit = async (data: VehicleScratchFormData) => {
    logFormState(data, "Form submission");

    // 제출 전 validation
    const validation = validateFormSubmission(data);
    
    if (!validation.success) {
      console.error("Validation failed:", validation.fieldErrors);
      setFormErrors(form, validation.fieldErrors);
      return;
    }

    try {
      // API 데이터 변환
      const apiData = transformFormToApi(validation.data);
      
      log("apiData", apiData);
      
      // API 호출
      await postPriceScratch(apiData as any);
      
      // TODO: 성공 시 결과 페이지로 이동
    } catch (error) {
      console.error("Failed to submit scratch form:", error);
      // 에러 처리 (필요에 따라 toast 메시지 등)
    } finally {
    }
  };

  // 현재 폼 상태
  const formState = form.watch();
  const isFormValid = checkRequiredFields(formState);
  const isDirty = form.formState.isDirty;

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isFormValid,
    isDirty,
    formState,
  };
};
