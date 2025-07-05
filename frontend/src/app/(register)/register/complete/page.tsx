"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { AuthAlertDialog } from "@/components/auth-alert-dialog";

function RegisterCompleteContent() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  if (!isAuthenticated) {
    return <AuthAlertDialog />;
  }

  return (
    <div className="min-h-screen">
      <AppBar />
      <main className="flex-col justify-center items-center pt-14 pb-20">
        <div className="p-4">
          <div className="flex justify-center items-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                1
              </div>
              <div className="w-24 h-px bg-gray-300"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                2
              </div>
              <div className="w-24 h-px bg-gray-300"></div>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                3
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              차량 등록이
              <br />
              완료되었습니다!
            </h1>
            <p className="text-gray-600 mb-8">
              등록하신 차량 정보가 성공적으로 저장되었습니다.
            </p>

            <div className="space-y-4">
              <Button
                className="w-full"
                size="lg"
                onClick={() => router.push("/")}
              >
                홈으로 돌아가기
              </Button>
              <Button
                className="w-full"
                variant="outline"
                size="lg"
                onClick={() => router.back()}
              >
                이전 페이지로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

export default function RegisterCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <AppBar />
        <main className="flex-col justify-center items-center pt-14 pb-20">
          <div className="p-4 text-center">
            <p>로딩 중...</p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    }>
      <RegisterCompleteContent />
    </Suspense>
  );
}
