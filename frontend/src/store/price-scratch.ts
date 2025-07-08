import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { VehicleScratchFormData } from "@/api/price/form/scratch-schema";

interface PriceScratchState {
  formData: VehicleScratchFormData | null;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  
  // Actions
  setFormData: (data: VehicleScratchFormData) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitted: (isSubmitted: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePriceScratchStore = create<PriceScratchState>()(
  persist(
    (set) => ({
      formData: null,
      isSubmitting: false,
      isSubmitted: false,
      error: null,
      
      setFormData: (data) => set({ formData: data }),
      setSubmitting: (isSubmitting) => set({ isSubmitting }),
      setSubmitted: (isSubmitted) => set({ isSubmitted }),
      setError: (error) => set({ error }),
      reset: () => set({ 
        formData: null, 
        isSubmitting: false, 
        isSubmitted: false, 
        error: null 
      }),
    }),
    {
      name: 'price-scratch-store', // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
      // 일부 상태만 persist하고 싶다면 다음과 같이 설정
      partialize: (state) => ({ 
        formData: state.formData,
        isSubmitted: state.isSubmitted,
        // isSubmitting과 error는 페이지 새로고침 시 초기화
      }),
    }
  )
);
