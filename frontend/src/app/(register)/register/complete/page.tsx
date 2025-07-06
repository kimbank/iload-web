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

          <div className=" pt-25 text-center">
            <img
              src="/assets/black-car_241x241.png"
              alt="차량 등록 완료 이미지"
              className="mx-auto max-w-60"
            />
            <h1 className="text-2xl font-semibold mb-5">
              차량 등록이 완료되었어요!
            </h1>
            <p className="text-xl mb-25">
              해당 차량의 시세도 바로<br />
              확인이 가능해요!
            </p>

            <div className="space-y-4">
              <Button
                className="w-full text-xl h-12"
                size="lg"
                // # TODO: 이 차량 등록 id로 시세 확인 페이지로 이동 ?id={id}
                onClick={() => router.push("/price/check")}
              >
                시세 확인하러 가기
              </Button>
              <Button
                className="w-full text-xl h-11"
                variant="ghost"
                size="lg"
                onClick={() => router.push("/")}
              >
                메인 화면으로 돌아가기
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
