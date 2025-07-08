"use client";

import { Button } from "@/components/ui/button";
import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import { useRouter } from "next/navigation";
import { usePriceScratchStore } from "@/store/price-scratch";
import { useEffect } from "react";
import { postPriceScratch } from "@/api/price/form/postPriceScratch";
import { transformFormToApi } from "@/api/price/form/scratch-schema";

export default function ScratchResultPage() {
  const router = useRouter();
  const { 
    formData, 
    isSubmitting, 
    isSubmitted, 
    error, 
    setSubmitting, 
    setSubmitted, 
    setError,
    reset
  } = usePriceScratchStore();

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    const submitData = async () => {
      if (!formData) {
        router.push('/price/scratch');
        return;
      }

      if (isSubmitted) {
        return; // 이미 제출됨
      }

      setSubmitting(true);
      setError(null);

      try {
        const apiData = transformFormToApi(formData);
        await postPriceScratch(apiData as any);
        setSubmitted(true);
      } catch (error) {
        console.error("Failed to submit scratch form:", error);
        setError("서버 요청에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setSubmitting(false);
      }
    };

    submitData();
  }, [formData, isSubmitted, router, setSubmitting, setSubmitted, setError]);

  // 폼 데이터가 없으면 입력 페이지로 리다이렉트
  if (!formData) {
    return (
      <div className="min-h-screen bg-white">
        <AppBar />
        <main className="pt-14 pb-20 px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <p className="text-lg text-gray-600 mb-4">
              잘못된 접근입니다. 다시 입력해주세요.
            </p>
            <Button
              onClick={() => {
                reset();
                router.push('/price/scratch');
              }}
              className="bg-black text-white"
            >
              새로 입력하기
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  // 로딩 중
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-white">
        <AppBar />
        <main className="pt-14 pb-20 px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">
                정보를 처리하고 있습니다...
              </p>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <AppBar />
        <main className="pt-14 pb-20 px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-8">
              <img
                src="/assets/complete-car.png"
                alt="Error Icon"
                className="max-w-40 mb-4 m-auto"
              />
              <p className="text-lg text-gray-600 mb-4">
                {error}
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-md">
              <Button
                onClick={() => {
                  // TODO: 다시 시도 로직
                  // setError(null);
                  // setSubmitted(false);
                }}
                className="w-full bg-black text-white"
                size="lg"
              >
                다시 시도하기
              </Button>
              
              <Button
                onClick={() => router.push('/price/scratch')}
                variant="outline"
                className="w-full"
                size="lg"
              >
                수정하기
              </Button>

              <Button
                onClick={() => {
                  reset();
                  router.push('/price/scratch');
                }}
                variant="outline"
                className="w-full border-gray-300 text-gray-600"
                size="lg"
              >
                새로 입력하기
              </Button>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  // 성공
  return (
    <div className="min-h-screen bg-white">
      <AppBar />

      <main className="pt-14 pb-20 px-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">정보 제출 완료!</h1>
            <p className="text-lg text-gray-600 mb-2">
              차량 정보가 성공적으로 제출되었습니다.
            </p>
            <p className="text-lg text-gray-600">
              빠른 시일 내에 시세 정보를 안내드리겠습니다.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-md">
            <Button
              onClick={() => router.push('/price')}
              className="w-full bg-black text-white"
              size="lg"
            >
              시세 조회 페이지로 이동
            </Button>
            
            <Button
              onClick={() => router.push('/price/scratch')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              수정하기
            </Button>

            <Button
              onClick={() => {
                reset();
                router.push('/price/scratch');
              }}
              variant="outline"
              className="w-full border-gray-300 text-gray-600"
              size="lg"
            >
              새로 입력하기
            </Button>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
