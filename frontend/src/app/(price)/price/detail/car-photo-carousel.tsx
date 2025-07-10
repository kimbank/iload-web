"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageViewerModal from "@/components/image-viewer-modal";

interface CarPhotoCarouselProps {
  photos: string[];
}

const CarPhotoCarousel = ({ photos }: CarPhotoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalImages = photos.length;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="relative mb-6 bg-gray-100 rounded-lg overflow-hidden">
        <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-200">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-500 text-2xl">📷</span>
          </div>
          <span className="text-gray-600 text-sm">등록된 사진이 없습니다</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative mb-6 bg-gray-900 border border-gray-300 rounded-lg overflow-hidden">
        <img
          src={photos[currentIndex] || "/assests/error-image.png"}
          alt={`차량 사진 ${currentIndex + 1}`}
          className="w-full h-64 object-cover cursor-pointer"
          onClick={openModal}
          onError={(e) => {
            // 이미지 로드 실패시 기본 이미지로 대체
            const target = e.target as HTMLImageElement;
            target.src = "/assets/black-car_241x241.png";
          }}
        />
        {/* Filter Icon */}
        <button className="absolute top-2 right-2 bg-white rounded-full size-7 p-1">
          <span className="icon-[mage--filter] w-4 h-4" />
        </button>
        {/* <span className="absolute top-2 right-2 bg-white rounded-full size-7 p-1 icon-[mage--filter] w-4 h-4" /> */}

        {/* Image Navigation */}
        {totalImages > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            <button onClick={prevImage}>
              <ChevronLeft size={16} />
            </button>
            <span>
              {currentIndex + 1} / {totalImages}
            </span>
            <button onClick={nextImage}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Navigation dots */}
        {totalImages > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 이미지 뷰어 모달 */}
      <ImageViewerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        photos={photos}
        initialIndex={currentIndex}
      />
    </>
  );
};

export default CarPhotoCarousel;
