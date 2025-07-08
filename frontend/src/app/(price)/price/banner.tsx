"use client";

export function Banner() {
  return (
    <section className="relative w-full h-full overflow-hidden bg-[#000000] text-white p-4 md:p-6 flex rounded-lg mb-6">
      <div className="flex flex-col gap-2">
        <h1 className="md:text-xl text-lg font-semibold">
          미등록 차량을<br />
          간단하게 조회할 수 있어요
        </h1>
        
        <div
          className="flex items-center text-gray-50 hover:text-gray-300 transition-colors cursor-pointer group mt-1"
          onClick={() => {}}
        >
          <span className="md:text-lg text-base font-medium">지금 바로 조회하기</span>
          <svg 
            className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <img
        src="/assets/price-car.png"
        alt="차량 일러스트"
        className="block absolute right-0 bottom-0 w-32 md:w-40 h-auto object-cover"
      />
    </section>
  );
}

export default Banner;
