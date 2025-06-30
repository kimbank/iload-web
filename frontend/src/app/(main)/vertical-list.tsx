"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleData, getAllVehicles, getAccidentFreeVehicles, getPaintedFreeVehicles } from "@/api/vehicles";
import { Button } from "@/components/ui/button";

type VehicleType = 'all' | 'accident-free' | 'painted-free';

// API 타입에 따른 함수 매핑
const vehicleApiFunctions = {
  'all': getAllVehicles,
  'accident-free': getAccidentFreeVehicles,
  'painted-free': getPaintedFreeVehicles,
};

// 로딩 상태를 관리하는 커스텀 훅
function useVehicleData(type: VehicleType = 'all') {
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
        setError('차량 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [type]);

  return { vehicles, loading, error };
}

// 차량 카드 컴포넌트 (세로 목록용)
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
    <div className="flex gap-3 last:border-b-0 transition-colors cursor-pointer">
      <div className="relative w-46 h-30 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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

      <div className="flex">
        <span className="flex flex-col justify-between py-4">
          <span>
            <h3 className="font-normal text-gray-600 text-base leading-tight">
              {vehicle.title}
            </h3>
            <p className="font-normal text-gray-500 text-sm">
              {vehicle.subtitle}
            </p>
          </span>
          <p className="font-bold text-gray-900 text-base">{vehicle.price}</p>
        </span>
      </div>
    </div>
  );
}

// 메인 세로 리스트 컴포넌트
export default function VerticalList({
  title = "차량 목록",
  type: initialType = "all"
}: {
  title?: string;
  type?: VehicleType;
}) {
  const [selectedType, setSelectedType] = useState<VehicleType>(initialType);
  const { vehicles, loading, error } = useVehicleData(selectedType);

  if (error) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          {error}
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
          variant={selectedType === 'all' ? "default" : "outline"}
          className="w-17"
          onClick={() => setSelectedType('all')}
        >
          전체
        </Button>
        <Button
          variant={selectedType === 'accident-free' ? "default" : "outline"}
          className="w-17"
          onClick={() => setSelectedType('accident-free')}
        >
          무사고
        </Button>
        <Button
          variant={selectedType === 'painted-free' ? "default" : "outline"}
          className="w-17"
          onClick={() => setSelectedType('painted-free')}
        >
          무도색
        </Button>
      </div>

      <div className="flex flex-col gap-4 bg-white rounded-lg">
        {loading
          ? // 로딩 중일 때 skeleton 카드들 표시
            Array.from({ length: 4 }).map((_, index) => (
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