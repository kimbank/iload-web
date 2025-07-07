"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { components } from "@/api/openapi-schema";
import useHighPriceVehicles from "@/api/main/useHighPriceVehicles";
import useLatestRegisteredVehicles from "@/api/main/useLatestRegisteredVehicles";

type VehicleType = "latest-registered" | "high-price";

// 차량 카드 컴포넌트
function VehicleCard({
  vehicle,
  loading,
}: {
  vehicle?: components["schemas"]["RegisteredVehicleCardResponse"];
  loading?: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (loading) {
    return (
      <div className="transition-shadow cursor-pointer">
        <Skeleton className="w-full aspect-[4/3] mb-3 rounded-md" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="h-4 w-2/5 mt-2" />
          <Skeleton className="h-6 w-1/3 mt-3" />
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="transition-shadow cursor-pointer">
      <div className="relative w-full aspect-[4/3] mb-3 bg-gray-100 rounded-md overflow-hidden">
        {vehicle.photos && vehicle.photos[0]?.url ? (
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
          <Skeleton className="w-full h-full flex items-center justify-center">
            {/* <span className="text-gray-400 text-sm">이미지 없음</span> */}
          </Skeleton>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-normal text-gray-600 text-lg leading-tight">
          {vehicle.manufacturer || "제조사 미등록"}
        </h3>
        <p className="font-normal text-gray-600 text-sm">
          {vehicle.releaseYear ? `${vehicle.releaseYear}년` : "연식 미등록"}
          {" · "}
          {vehicle.mileage ? `${vehicle.mileage.toLocaleString()}km` : "주행거리 미등록"}
        </p>
        <p className="font-bold text-black text-base pt-1">
          {vehicle.price ? `${vehicle.price.toLocaleString()} 만원` : "가격 미등록"}
        </p>
      </div>
    </div>
  );
}

// 메인 그리드 리스트 컴포넌트
export default function GridList({
  title = "차량 목록",
  type = "latest-registered",
}: {
  title?: string;
  type?: VehicleType;
}) {
  // 타입에 따라 적절한 훅 사용
  const latestVehicles = useLatestRegisteredVehicles();
  const highPriceVehicles = useHighPriceVehicles();
  
  const { data: vehicles, isLoading: loading, isError: error, mutate } = 
    type === "latest-registered" ? latestVehicles : highPriceVehicles;

  if (error) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="text-center py-8 text-gray-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {loading
          ? // 로딩 중일 때 skeleton 카드들 표시
            Array.from({ length: type == "latest-registered" ? 2 : 4 }).map((_, index) => (
              <VehicleCard key={index} loading={true} />
            ))
          : // 데이터 로드 완료 후 실제 차량 카드들 표시
            vehicles?.map((vehicle: components["schemas"]["RegisteredVehicleCardResponse"]) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} loading={loading} />
            ))}
      </div>
    </div>
  );
}
