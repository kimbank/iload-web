"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyVehicles } from "@/api/mycar/useMyVehicles";
import { components } from "@/api/openapi-schema";
import { MANUFACTURERS } from "@/api/vehicle/form/vehicle-constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import deleteInProgressCard from "@/api/vehicle/deleteInProgressCard";

// 등록된 차량이 없을 때 표시할 컴포넌트
function NotFound() {
  return (
    <div className="flex flex-col gap-5 justify-center items-center p-8">
      <img
        src="/assets/complete-car.png"
        alt="not found"
        className="w-50"
      />
      <span className="justify-center items-center text-center">
        <h1 className="text-2xl font-semibold mb-5">아직 등록한 차량이 없어요</h1>
        <p className="text-xl font-medium text-gray-400 text-center">
          차량 등록 후 자세한 국가별 시세를 <br />
          확인할 수 있어요.
        </p>
      </span>
    </div>
  );
}

// 차량 카드 컴포넌트
function VehicleCard({
  vehicle,
  loading,
  isLast,
  lastVehicleElementRef,
  handleDeleteVehicle
}: {
  vehicle?: components["schemas"]["RegisteredVehicleCardResponse"];
  loading?: boolean;
  isLast?: boolean;
  lastVehicleElementRef?: (node: HTMLDivElement | null) => void;
  handleDeleteVehicle: (vehicleId: number) => void;
}) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  if (loading) {
    return (
      <div>
        <Skeleton className="w-full aspect-[1.24] rounded-lg mb-3" />
        <div className="space-y-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div 
      ref={isLast ? lastVehicleElementRef : null}
      className="cursor-pointer"
    >
      {/* 차량 이미지 */}
      <div className="relative w-full aspect-[1.24] bg-gray-200 rounded-lg mb-3 overflow-hidden">
        {vehicle.thumbnailUrl ? (
          <>
            {!imageLoaded && <Skeleton className="absolute inset-0" />}
            <img
              src={vehicle.thumbnailUrl}
              alt={`${vehicle.manufacturer} 차량 사진`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">이미지 없음</span>
          </div>
        )}
        <Popover>
          <PopoverTrigger className="block absolute top-2 right-2 w-6 h-6 rounded-full bg-white" />
          <PopoverContent className="w-fit py-2">
            <div className="flex flex-col gap-2">
              {/* 삭제하기 */}
              <button
                className="text-gray-600"
                onClick={() => handleDeleteVehicle(vehicle.id || -1)}
              >
                삭제하기
              </button>
              {/* 수정하기 */}
              <button
                className="text-gray-600"
                onClick={() => router.push(`/register/basic-info?id=${vehicle.id}`)}
              >
                수정하기
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* 차량 정보 */}
      <div className="space-y-1">
        <h4 className="text-lg font-medium text-gray-500">
          {MANUFACTURERS[vehicle.manufacturer as keyof typeof MANUFACTURERS] || vehicle.manufacturer || "제조사 미등록"}
        </h4>
        <p className="text-base text-gray-500">
          {vehicle.releaseYear && `${vehicle.releaseYear}년`}
          {vehicle.mileage && ` · ${vehicle.mileage.toLocaleString()}km`}
        </p>
        <p className="text-lg font-bold text-gray-900">
          {vehicle.price ? `${vehicle.price.toLocaleString()}원` : "가격 미등록"}
        </p>
      </div>
    </div>
  );
}

export default function MyVehicles() {
  const { vehicles, isLoading, isValidating, canLoadMore, loadMore, isError, mutate } =
    useMyVehicles({
      size: 4,
    });

  const observer = useRef<IntersectionObserver | null>(null);

  // 마지막 요소에 대한 ref callback
  const lastVehicleElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isValidating) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && canLoadMore) {
          loadMore();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [isLoading, isValidating, canLoadMore, loadMore]
  );

  const [showDeleteAlertDialog, setShowDeleteAlertDialog] = useState(false);
  const [vehicleIdToDelete, setVehicleIdToDelete] = useState<number>(-1);
  async function handleDeleteVehicle(vehicleId: number) {
    if (vehicleId <= 0) {
      return;
    }
    setVehicleIdToDelete(vehicleId);
    if (!showDeleteAlertDialog) {
      setShowDeleteAlertDialog(true);
      return;
    }

    try {
      // TODO: inProgressCard 대신 내차 삭제 API 호출
      await deleteInProgressCard(vehicleId);
    } catch (error) {
      alert("차량 삭제에 실패했습니다. 다시 시도해주세요.");
      return;
    } finally {
      setShowDeleteAlertDialog(false);
      await mutate();
    }
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <NotFound />
    );
  }
  // 차량이 없을 때 NotFound 컴포넌트 표시
  if (vehicles.length === 0 && !isLoading) {
    return (
      <NotFound />
    );
  }
  // 로딩 중이면서 차량이 없는 경우
  if (isLoading && vehicles.length === 0) {
    return (
      <NotFound />
    );
  }

  return (
    <div>
      <AlertDialog open={showDeleteAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>차량 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 차량을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlertDialog(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteVehicle(vehicleIdToDelete)}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* 제목 */}
      <h3 className="text-2xl font-semibold mb-6 text-black">
        나의 차량 목록이에요
      </h3>

      {/* 차량 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {vehicles.map((vehicle, index) => {
          const isLastElement = vehicles.length === index + 1;
          return (
            <VehicleCard 
              key={`${vehicle.id}-${index}`} 
              vehicle={vehicle}
              isLast={isLastElement}
              lastVehicleElementRef={lastVehicleElementRef}
              handleDeleteVehicle={handleDeleteVehicle}
            />
          );
        })}

        {/* 로딩 상태 */}
        {(isLoading || isValidating) && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <VehicleCard key={`loading-${index}`} loading={true} handleDeleteVehicle={() => {}} />
            ))}
          </>
        )}
      </div>

      {/* 더 이상 로드할 데이터가 없을 때 */}
      {!canLoadMore && vehicles.length > 0 && (
        <div className="flex justify-center items-center p-4 mt-4">
          <p className="text-gray-300">모든 차량을 불러왔습니다.</p>
        </div>
      )}
    </div>
  );
}