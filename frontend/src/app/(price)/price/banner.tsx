"use client";

export function Banner() {
  return (
    <div className="bg-gray-900 text-white rounded-lg p-6 mb-6 relative overflow-hidden h-44">
      <div className="flex justify-between items-center">
        <div className="z-10">
          <h2 className="text-2xl mb-2">
            미등록 차량을<br />
            간단하게 조회할 수 있어요
          </h2>
          <button
            className="flex items-center text-base text-white hover:text-white hover:cursor-pointer"
            onClick={() => {}}
          >
            지금 바로 조회하기
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {/* 차량 일러스트 */}
        <img
          src="/banner/car.png"
          alt="차량 일러스트"
          className="w-auto object-contain absolute right-4 top-[100px] transform -translate-y-1/2 z-0"
        />
        {/* <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-24 h-12 bg-gray-400 rounded-lg opacity-80"></div>
        </div> */}
      </div>
    </div>
  );
}

export default Banner;
