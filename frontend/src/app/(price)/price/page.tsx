"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import Banner from "./banner";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageRegisteredVehicles } from "@/api/main/usePageRegisteredVehicles";
import { components } from "@/api/openapi-schema";
import { MANUFACTURERS } from "@/api/vehicle/form/vehicle-constants";
import {Button} from "@/components/ui/button";

// 차량 카드 컴포넌트
function VehicleCard({
  vehicle,
  loading,
  isLast,
  lastVehicleElementRef,
  selectedVehicle,
  setSelectedVehicle,
}: {
  vehicle?: components["schemas"]["RegisteredVehicleCardResponse"];
  loading?: boolean;
  isLast?: boolean;
  lastVehicleElementRef?: (node: HTMLDivElement | null) => void;
  selectedVehicle: number | undefined;
  setSelectedVehicle: (vehicleId: number | undefined) => void;
}) {
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
      className={`cursor-pointer`}
      onClick={() => setSelectedVehicle(
        selectedVehicle === vehicle.id ? undefined : vehicle.id
      )}
    >
      {/* 차량 이미지 */}
      <div className={`relative w-full aspect-[1.24] bg-gray-200 rounded-lg mb-3 overflow-hidden `
        + (selectedVehicle === vehicle.id && "border-2 border-black")
      }>
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

export default function PricePage() {
  const router = useRouter();
  const { vehicles, isLoading, isValidating, canLoadMore, loadMore, isError } = 
    usePageRegisteredVehicles({
      noAccident: false,
      noPaint: false,
      size: 4,
    });

  const [selectedVehicle, setSelectedVehicle] = useState<number | undefined>(undefined);

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

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <AppBar />
        <main className="pt-14 pb-20 px-4">
          <Banner />
          <h3 className="text-2xl font-semibold mb-6 text-black">
            시세 조회할 차량을 선택해주세요.
          </h3>
          <div className="text-center py-8 text-gray-500">
            차량 목록을 불러오는 중 오류가 발생했습니다.
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-white">
        <AppBar />
        <main className="pt-14 pb-20 px-4">
          {/* 상단 배너 */}
          <Banner />

          {/* 제목 */}
          <h3 className="text-2xl font-semibold mb-6 text-black">
            시세 조회할 차량을 선택해주세요.
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
                  selectedVehicle={selectedVehicle}
                  setSelectedVehicle={setSelectedVehicle}
                />
              );
            })}

            {/* 로딩 상태 */}
            {(isLoading || isValidating) && (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <VehicleCard key={`loading-${index}`} loading={true} selectedVehicle={-1} setSelectedVehicle={() => {}} />
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

          {/* 데이터가 없을 때 */}
          {!isLoading && vehicles.length === 0 && (
            <div className="flex justify-center items-center p-8">
              <p className="text-gray-300">조건에 맞는 차량이 없습니다.</p>
            </div>
          )}
        </main>
        <section
          className="fixed bottom-20 w-full max-w-2xl min-w-xs px-4"
        >
          <Button
            className="w-full text-xl h-12"
            disabled={selectedVehicle === undefined}
            onClick={() => {
              if (selectedVehicle !== undefined) {
                router.push(`/price/detail?id=${selectedVehicle}`);
              }
            }}
          >
            다음으로
          </Button>
        </section>
        <BottomNavigation />
      </div>
  );
}
