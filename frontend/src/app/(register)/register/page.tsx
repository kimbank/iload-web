"use client";

import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import Divider from "@/components/divider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import Link from "next/link";
import { useInProgressCards } from "@/api/vehicle/useInProgressCards";
import { postCreateEmpty } from "@/api/vehicle/postCreateEmpty";
import { deleteInProgressCard } from "@/api/vehicle/deleteInProgressCard";
import { useAuthStore } from "@/store/auth";
import { AuthAlertDialog } from "@/components/auth-alert-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { data: inProgressCars, isLoading, isError, mutate } = useInProgressCards();
  const [deletingId, setDeletingId] = useState<number | undefined>(undefined);

  const handleNewRegistration = async () => {
    try {
      const response = await postCreateEmpty();
      const newId = response.data;
      router.push(`/register/basic-info?id=${newId}`);
    } catch (error) {
      console.error("Failed to create empty registration", error);
    } finally {
      // 데이터 새로고침
      mutate();
    }
  };

  const handleDeleteCard = async (id: number | undefined) => {
    try {
      if (!id) return; // id가 없으면 아무 작업도 하지 않음
      setDeletingId(id);
      await deleteInProgressCard(id);
    } catch (error) {
      console.error("Failed to delete card", error);
    } finally {
      // 데이터 새로고침
      mutate();
      setDeletingId(undefined);
    }
  };

  if (!isAuthenticated) {
    return <AuthAlertDialog />;
  }

  return (
    <div className="min-h-screen">
      <AppBar />
      <main className="flex-col justify-center items-center pt-14 pb-20">
        <section className="p-6">
          <Button className="w-full" size="lg" onClick={handleNewRegistration}>
            + 새로운 차량 등록하기
          </Button>
        </section>

        <Divider />

        <section className="p-6">
          <h2 className="text-xl font-bold mb-4">작성중인 차량</h2>
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="mb-4">
                  <CardHeader>
                    <Skeleton className="h-6 w-2/5" />
                    <Skeleton className="h-4 w-1/3 mt-2" />
                  </CardHeader>
                  <CardContent>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {isError && <p className="text-center text-gray-300">데이터를 불러오는데 실패했습니다.</p>}
          {inProgressCars && inProgressCars.length > 0 ? (
            inProgressCars.map((car) => (
              <Card key={car.id} className="mb-4 relative">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10 h-8 w-8 p-0 hover:bg-gray-100"
                      disabled={deletingId === car.id}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>차량 등록을 삭제하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        이 작업은 취소할 수 없습니다. 작성 중인 차량 정보가 모두 삭제됩니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteCard(car.id)}>
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <CardHeader>
                  <CardTitle>{car.manufacturer || "차량 정보 없음"}</CardTitle>
                  <CardDescription>
                    {car.progressStep}/{car.progressTotalSteps} 단계 진행중
                  </CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/register/basic-info?id=${car.id}`}
                    passHref
                    className="w-full"
                  >
                    <Button className="w-full">이어서 작성하기</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            !isLoading && <p className="text-center text-gray-500">작성중인 차량이 없습니다.</p>
          )}
        </section>
      </main>
      <BottomNavigation />
    </div>
  );
}
