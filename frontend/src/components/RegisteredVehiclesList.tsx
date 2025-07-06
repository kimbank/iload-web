"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePageRegisteredVehicles } from "@/api/main/usePageRegisteredVehicles";

export default function RegisteredVehiclesList() {
  const { vehicles, isLoading, isValidating, canLoadMore, loadMore, isError } = 
    usePageRegisteredVehicles({
      noAccident: false,
      noPaint: false,
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

  if (isError) {
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-gray-200">차량 목록을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {vehicles.map((vehicle, index) => {
        // 마지막 요소에 ref 설정
        const isLastElement = vehicles.length === index + 1;
        
        return (
          <div
            key={vehicle.id}
            ref={isLastElement ? lastVehicleElementRef : null}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {vehicle.manufacturer || "제조사 미등록"} 
                  {vehicle.releaseYear && ` (${vehicle.releaseYear}년)`}
                </h3>
                <p className="text-gray-600">등록자: {vehicle.username}</p>
                
                <div className="mt-2 space-y-1">
                  {vehicle.mileage && (
                    <p className="text-sm text-gray-500">
                      주행거리: {vehicle.mileage.toLocaleString()}km
                    </p>
                  )}
                  {vehicle.price && (
                    <p className="text-sm font-medium text-blue-600">
                      가격: {vehicle.price.toLocaleString()}원
                    </p>
                  )}
                </div>
                
                <div className="mt-2 text-xs text-gray-400">
                  등록일: {new Date(vehicle.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </div>
              
              {vehicle.photos && vehicle.photos[0]?.url && (
                <div className="ml-4">
                  <img
                    src={vehicle.photos[0].url}
                    alt="차량 사진"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 로딩 상태 */}
      {(isLoading || isValidating) && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">로딩 중...</span>
        </div>
      )}

      {/* 더 이상 로드할 데이터가 없을 때 */}
      {!canLoadMore && vehicles.length > 0 && (
        <div className="flex justify-center items-center p-4">
          <p className="text-gray-500">모든 차량을 불러왔습니다.</p>
        </div>
      )}

      {/* 데이터가 없을 때 */}
      {!isLoading && vehicles.length === 0 && (
        <div className="flex justify-center items-center p-8">
          <p className="text-gray-500">등록된 차량이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
