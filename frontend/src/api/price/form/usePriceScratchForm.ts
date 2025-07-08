import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  VehicleScratchFormData,
  vehicleScratchInputSchema,
} from "@/api/price/form/scratch-schema";
import {
  getDefaultFormValues,
  validateFormSubmission,
  setFormErrors,
  checkRequiredFields,
  logFormState,
} from "@/api/price/form/form-utils";
import { usePriceScratchStore } from "@/store/price-scratch";

export const usePriceScratchForm = () => {
  const router = useRouter();
  const { setFormData, setError } = usePriceScratchStore();

  // React Hook Form 설정
  const form = useForm<VehicleScratchFormData>({
    resolver: zodResolver(vehicleScratchInputSchema),
    mode: "onChange", // 실시간 validation
    defaultValues: getDefaultFormValues(),
  });

  // 폼 제출 핸들러 (API 호출 없이 상태 저장만)
  const handleSubmit = async (data: VehicleScratchFormData) => {
    logFormState(data, "Form submission");

    // 제출 전 validation
    const validation = validateFormSubmission(data);
    
    if (!validation.success) {
      console.error("Validation failed:", validation.fieldErrors);
      setFormErrors(form, validation.fieldErrors);
      setError("입력한 정보를 확인해주세요");
      return;
    }

    try {
      // 상태에 폼 데이터 저장
      setFormData(validation.data);
      setError(null);
      
      // 결과 페이지로 이동
      router.push('/price/scratch/result');
    } catch (error) {
      console.error("Failed to save form data:", error);
      setError("데이터 저장에 실패했습니다");
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
