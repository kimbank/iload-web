"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { usePageRegisteredVehicles } from "@/api/main/usePageRegisteredVehicles";
import { components } from "@/api/openapi-schema";

type FilterState = {
  noAccident: boolean;
  noPaint: boolean;
};

// 차량 카드 컴포넌트 (세로 목록용)
function VehicleCard({
  vehicle,
  loading,
  isLast,
  lastVehicleElementRef,
}: {
  vehicle?: components["schemas"]["RegisteredVehicleCardResponse"];
  loading?: boolean;
  isLast?: boolean;
  lastVehicleElementRef?: (node: HTMLDivElement | null) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (loading) {
    return (
      <div className="flex gap-3 transition-colors cursor-pointer">
        <Skeleton className="w-46 h-30 rounded-md flex-shrink-0" />
        <div className="flex">
          <span className="flex flex-col justify-between py-4">
            <span className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </span>
            <Skeleton className="h-4 w-20" />
          </span>
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div 
      ref={isLast ? lastVehicleElementRef : null}
      className="flex gap-3 last:border-b-0 transition-colors cursor-pointer"
    >
      <div className="relative w-46 h-30 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        {vehicle.photos && vehicle.photos.length > 0 && vehicle.photos[0].url ? (
          <>
            {!imageLoaded && <Skeleton className="absolute inset-0" />}
            <Image
              src={vehicle.photos[0].url}
              alt={`${vehicle.manufacturer} 차량 사진`}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">이미지 없음</span>
          </div>
        )}
      </div>

      <div className="flex">
        <span className="flex flex-col justify-between py-4">
          <span>
            <h3 className="font-normal text-gray-600 text-base leading-tight">
              {vehicle.manufacturer || "제조사 미등록"}
            </h3>
            <p className="font-normal text-gray-500 text-sm">
              {vehicle.releaseYear && ` ${vehicle.releaseYear}년`}
              {" · "}
              {vehicle.mileage ? `${vehicle.mileage.toLocaleString()}km` : "주행거리 미등록"}
            </p>
          </span>
          <p className="font-bold text-gray-900 text-base">
            {vehicle.price ? `${vehicle.price.toLocaleString()}원` : "가격 미등록"}
          </p>
        </span>
      </div>
    </div>
  );
}

// 메인 세로 리스트 컴포넌트
export default function VerticalList({
  title = "차량 목록",
}: {
  title?: string;
}) {
  const [filters, setFilters] = useState<FilterState>({
    noAccident: false,
    noPaint: false,
  });

  const { vehicles, isLoading, isValidating, canLoadMore, loadMore, isError } = 
    usePageRegisteredVehicles({
      noAccident: filters.noAccident,
      noPaint: filters.noPaint,
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

  // 필터 로직
  const handleFilterChange = (filterType: 'all' | 'noAccident' | 'noPaint') => {
    if (filterType === 'all') {
      // 전체 선택 시 다른 필터 모두 해제
      setFilters({ noAccident: false, noPaint: false });
    } else if (filterType === 'noAccident') {
      // 무사고 토글
      setFilters(prev => ({ ...prev, noAccident: !prev.noAccident }));
    } else if (filterType === 'noPaint') {
      // 무도색 토글
      setFilters(prev => ({ ...prev, noPaint: !prev.noPaint }));
    }
  };

  // 전체가 선택되었는지 확인
  const isAllSelected = !filters.noAccident && !filters.noPaint;

  if (isError) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          차량 목록을 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="flex gap-3 mb-2">
        <Button
          variant={isAllSelected ? "default" : "outline"}
          className="w-17"
          onClick={() => handleFilterChange('all')}
        >
          전체
        </Button>
        <Button
          variant={filters.noAccident ? "default" : "outline"}
          className="w-17"
          onClick={() => handleFilterChange('noAccident')}
        >
          무사고
        </Button>
        <Button
          variant={filters.noPaint ? "default" : "outline"}
          className="w-17"
          onClick={() => handleFilterChange('noPaint')}
        >
          무도색
        </Button>
      </div>

      <div className="flex flex-col gap-4 bg-white rounded-lg">
        {vehicles.map((vehicle, index) => {
          const isLastElement = vehicles.length === index + 1;
          return (
            <VehicleCard 
              key={`${vehicle.id}-${index}`} 
              vehicle={vehicle}
              isLast={isLastElement}
              lastVehicleElementRef={lastVehicleElementRef}
            />
          );
        })}

        {/* 로딩 상태 */}
        {(isLoading || isValidating) && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <VehicleCard key={`loading-${index}`} loading={true} />
            ))}
          </>
        )}

        {/* 더 이상 로드할 데이터가 없을 때 */}
        {!canLoadMore && vehicles.length > 0 && (
          <div className="flex justify-center items-center p-4">
            <p className="text-gray-300">모든 차량을 불러왔습니다.</p>
          </div>
        )}

        {/* 데이터가 없을 때 */}
        {!isLoading && vehicles.length === 0 && (
          <div className="flex justify-center items-center p-8">
            <p className="text-gray-300">등록된 차량이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
