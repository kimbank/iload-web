"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  VehicleData,
  getRecentAddedVehicles,
  getHighPriceVehicles,
} from "@/api/vehicles";

type VehicleType = "recent-added" | "high-price";

// API 타입에 따른 함수 매핑
const vehicleApiFunctions = {
  "recent-added": getRecentAddedVehicles,
  "high-price": getHighPriceVehicles,
};

// 로딩 상태를 관리하는 커스텀 훅
function useVehicleData(type: VehicleType = "recent-added") {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiFunction = vehicleApiFunctions[type];
        const response = await apiFunction();

        setVehicles(response.vehicles);
      } catch (err) {
        setError("차량 정보를 불러오는데 실패했습니다.");
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [type]);

  return { vehicles, loading, error };
}

// 차량 카드 컴포넌트
function VehicleCard({
  vehicle,
  loading,
}: {
  vehicle?: VehicleData;
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
        {vehicle.imageUrl ? (
          <>
            {!imageLoaded && <Skeleton className="absolute inset-0" />}
            <Image
              src={vehicle.imageUrl}
              alt={vehicle.title}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-normal text-gray-600 text-lg leading-tight">
          {vehicle.title}
        </h3>
        <p className="font-normal text-gray-600 text-base">
          {vehicle.subtitle}
        </p>
        <p className="font-bold text-gray-900 text-lg pt-1">{vehicle.price}</p>
      </div>
    </div>
  );
}

// 메인 그리드 리스트 컴포넌트
export default function GridList({
  title = "차량 목록",
  type = "recent-added",
}: {
  title?: string;
  type?: VehicleType;
}) {
  const { vehicles, loading, error } = useVehicleData(type);

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
            Array.from({ length: type == "recent-added" ? 2 : 4 }).map((_, index) => (
              <VehicleCard key={index} loading={true} />
            ))
          : // 데이터 로드 완료 후 실제 차량 카드들 표시
            vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
      </div>
    </div>
  );
}
