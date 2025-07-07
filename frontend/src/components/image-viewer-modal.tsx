'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
  initialIndex: number;
}

const ImageViewerModal = ({ isOpen, onClose, photos, initialIndex }: ImageViewerModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [swipeStart, setSwipeStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때 현재 인덱스 업데이트
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const nextImage = () => {
    setCurrentIndex(prev => prev < photos.length - 1 ? prev + 1 : 0);
    resetTransform();
  };

  const prevImage = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : photos.length - 1);
    resetTransform();
  };

  const resetTransform = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => prev + 90);
  };

  // 마우스 드래그
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 터치 이벤트 (핀치 줌, 드래그)
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1) {
      setSwipeStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // 핀치 줌
      const distance = getTouchDistance(e.touches);
      if (lastTouchDistance > 0) {
        const ratio = distance / lastTouchDistance;
        setScale(prev => Math.min(Math.max(prev * ratio, 0.5), 5));
      }
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1 && scale > 1) {
      // 단일 터치 드래그 (확대된 상태에서만)
      const touch = e.touches[0];
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setPosition(prev => ({
          x: prev.x + (touch.clientX - rect.width / 2),
          y: prev.y + (touch.clientY - rect.height / 2)
        }));
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0 && scale === 1) {
      // 스와이프 감지 (확대되지 않은 상태에서만)
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - swipeStart.x;
      const deltaY = Math.abs(touch.clientY - swipeStart.y);
      
      // 수평 스와이프이고 충분한 거리를 이동했을 때
      if (Math.abs(deltaX) > 50 && deltaY < 100) {
        if (deltaX > 0) {
          prevImage();
        } else {
          nextImage();
        }
      }
    }
    setLastTouchDistance(0);
  };

  // 더블 탭으로 줌 토글
  let tapTimeout: NodeJS.Timeout | null = null;
  const handleImageTap = (e: React.TouchEvent) => {
    if (tapTimeout) {
      // 더블 탭
      clearTimeout(tapTimeout);
      tapTimeout = null;
      if (scale === 1) {
        setScale(2);
      } else {
        resetTransform();
      }
    } else {
      // 첫 번째 탭
      tapTimeout = setTimeout(() => {
        tapTimeout = null;
      }, 300);
    }
  };

  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      resetTransform();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-51 bg-black bg-opacity-90 flex items-center justify-center">
      {/* 헤더 */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 text-white">
        <span className="text-lg font-medium">
          {currentIndex + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-400 hover:bg-opacity-20 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* 하단 컨트롤 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center items-center gap-4 p-4 text-white">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-400 hover:bg-opacity-20 rounded-full transition-colors"
          disabled={scale <= 0.5}
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-400 hover:bg-opacity-20 rounded-full transition-colors"
          disabled={scale >= 5}
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={handleRotate}
          className="p-2 hover:bg-gray-400 hover:bg-opacity-20 rounded-full transition-colors"
        >
          <RotateCw size={20} />
        </button>
        <button
          onClick={resetTransform}
          className="px-3 py-1 text-sm hover:bg-gray-400 hover:bg-opacity-20 rounded transition-colors"
        >
          리셋
        </button>
      </div>

      {/* 이미지 컨테이너 */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={(e) => {
          handleTouchEnd(e);
          if (e.touches.length === 0) {
            handleImageTap(e);
          }
        }}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'pointer' }}
      >
        <img
          ref={imageRef}
          src={photos[currentIndex]}
          alt={`사진 ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/assets/black-car_241x241.png';
          }}
        />

        {/* 이전/다음 버튼 */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 text-white hover:bg-gray-400 hover:bg-opacity-40 rounded-full transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 text-white hover:bg-gray-400 hover:bg-opacity-40 rounded-full transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 하단 썸네일 도트 */}
      {photos.length > 1 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                resetTransform();
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-gray-500 bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageViewerModal;
