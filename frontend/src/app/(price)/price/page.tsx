import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import Banner from "./banner";

// 임시 차량 데이터
const vehicleData = [
  { id: 1, name: "차종 이름 영역", year: "년식 & 주행거리 영역", price: "9999 만원" },
  { id: 2, name: "차종 이름 영역", year: "년식 & 주행거리 영역", price: "9999 만원" },
  { id: 3, name: "차종 이름 영역", year: "년식 & 주행거리 영역", price: "9999 만원" },
  { id: 4, name: "차종 이름 영역", year: "년식 & 주행거리 영역", price: "9999 만원" },
  { id: 5, name: "차종 이름 영역", year: "년식 & 주행거리 영역", price: "9999 만원" },
  { id: 6, name: "차종 이름 영역", year: "년식 & 주행거리 영역", price: "9999 만원" },
];

export function PricePage() {
  return (
      <div className="min-h-screen bg-white">
        <AppBar />
        <main className="pt-14 pb-20 px-4">
          {/* 상단 배너 */}
          <Banner />

          {/* 제목 */}
          <h3 className="text-2xl font-semibold mb-6 text-black">
            시세 조회할 차량을 선택해주세요.
          </h3>

          {/* 차량 그리드 */}
          <div className="grid grid-cols-2 gap-4">
            {vehicleData.map((vehicle) => (
              <div
                key={vehicle.id}
              >
                {/* 차량 이미지 플레이스홀더 */}
                <div className="w-full h-60 bg-gray-200 rounded-lg mb-3"></div>
                
                {/* 차량 정보 */}
                <div className="space-y-1">
                  <h4 className="text-lg font-medium text-gray-500">{vehicle.name}</h4>
                  <p className="text-base text-gray-500">{vehicle.year}</p>
                  <p className="text-lg font-bold text-gray-900">{vehicle.price}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
        <BottomNavigation />
      </div>
  );
}

export default PricePage;
