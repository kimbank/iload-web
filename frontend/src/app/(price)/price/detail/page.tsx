'use client';

import React, { Suspense } from 'react';
import CountryDetailCard from './country-detail-card';
import CarPhotoCarousel from './car-photo-carousel';
import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import { useSearchParams } from "next/navigation";
import { usePriceDetails } from "@/api/price/usePriceDetails";

// 샘플 데이터
const uaeData = [
  { month: '4월', value: 100 },
  { month: '5월', value: 300 },
  { month: '6월', value: 200 },
  { month: '7월', value: 400 }
];

const russiaData = [
  { month: '4월', value: 100 },
  { month: '5월', value: 300 },
  { month: '6월', value: 200 },
  { month: '7월', value: 400 }
];

const gabonData = [
  { month: '4월', value: 100 },
  { month: '5월', value: 300 },
  { month: '6월', value: 200 },
  { month: '7월', value: 400 }
];

interface CountryData {
  flag: string;
  name: string;
  subtitle: string;
  data: typeof uaeData;
  annotation?: {
    date: string;
    price: string;
  };
}

function PriceDetailPageContent() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("id");
  const numericVehicleId = vehicleId ? parseInt(vehicleId, 10) : null;
  
  const { data: priceData, isLoading: isPriceLoading, isError: isPriceError } = usePriceDetails(numericVehicleId);

  // 로딩 상태
  if (isPriceLoading) {
    return (
      <div className="min-h-screen bg-white">
        <AppBar />
        <main className="pt-14 pb-20 px-4">
          <div className="mt-6">
            <p className="text-2xl font-semibold mb-5">
              데이터를 불러오는 중...
            </p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  // 에러 상태
  if (isPriceError) {
    return (
      <div className="min-h-screen bg-white">
        <AppBar />
        <main className="pt-14 pb-20 px-4">
          <div className="mt-6">
            <p className="text-2xl font-semibold mb-5">
              데이터를 불러올 수 없습니다
            </p>
            <p className="text-gray-600">
              차량 정보나 사진을 불러오는 중 오류가 발생했습니다.
            </p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  // 우선순위: 실제 업로드된 사진 > PriceDetailResponse의 photos > 빈 배열
  let photosToShow: string[] = [];
  
  if (priceData?.photos && priceData.photos?.length > 0) {
    photosToShow = priceData.photos;
  }
  // 국가별 데이터 (현재는 샘플 데이터, 추후 API에서 가져올 수 있음)
  const countries: CountryData[] = [
    {
      flag: '🇦🇪',
      name: '아랍에미리트',
      subtitle: '(예상 판매가)원',
      data: uaeData
    },
    {
      flag: '🇷🇺',
      name: '러시아',
      subtitle: '(예상 판매가)원',
      data: russiaData,
      annotation: {
        date: '2025-04-31',
        price: '1,018 만원'
      }
    },
    {
      flag: '🇬🇦',
      name: '가봉',
      subtitle: '(예상 판매가)원',
      data: gabonData
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <AppBar />

      {/* Main Content */}
      <main className="pt-14 pb-20 px-4">
        {/* Title */}
        <div className="mt-6">
          <p className="text-2xl font-semibold mb-5">
            해당 차량의 국가별 <br />
            시세를 조회했어요
          </p>
        </div>

        {/* Car Photo Carousel */}
        <CarPhotoCarousel photos={photosToShow} />

        {/* Country Price Data */}
        <div className="space-y-8">
          {countries.map((country, index) => (
            <CountryDetailCard key={index} country={country} />
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}

const PriceDetailPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <AppBar />
        <main className="pt-14 pb-20 px-4">
          <div className="mt-6">
            <p className="text-2xl font-semibold mb-5">
              로딩 중...
            </p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    }>
      <PriceDetailPageContent />
    </Suspense>
  );
};

export default PriceDetailPage;
