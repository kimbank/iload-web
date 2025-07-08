export default function ApplicationBanner() {
  return (
    <section className="relative w-full h-full overflow-hidden bg-[#edf6ff] black p-4 md:p-6 flex">
      <div className="flex flex-col gap-2">
        <h1 className="md:text-xl text-lg font-semibold">
          믿을 수 있는<br />
          수출 중고차 품질진단 플랫폼
        </h1>
        
        {/*<p className="md:text-lg text-xs text-gray-300">*/}
        {/*  신뢰할 수 있는 중고차 진단 서비스로<br />*/}
        {/*  안전하고 투명한 거래를 경험하세요*/}
        {/*</p>*/}
        
        <div
          className="flex items-center text-gray-400 hover:text-gray-300 transition-colors cursor-pointer group mt-1"
        >
          <span className="md:text-lg text-base font-medium">어플 설치하기</span>
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
        src="/assets/application-car.png"
        alt="Application Banner"
        className="block absolute right-0 bottom-0 w-40 md:w-60 h-auto object-cover"
      />
    </section>
  );
}
