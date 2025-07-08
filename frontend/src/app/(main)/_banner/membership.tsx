import { Badge } from "@/components/ui/badge";

export default function MembershipBanner() {
  return (
    <section className="relative w-full h-full overflow-hidden bg-[#2c2c2c] text-white p-4 md:p-6 flex">
      <div className="flex flex-col gap-2">
        <h1 className="md:text-xl text-lg font-semibold">
          요금제 한눈에 보기
        </h1>
        
        <p className="md:text-lg text-xs text-gray-300">
          회원 등급별 연회비 혜택을 확인하고<br />
          더 효율적으로 가입해보세요
        </p>
        
        <div className="flex flex-wrap gap-3">
          <Badge variant="default" className="bg-black text-white md:px-3 py-2 md:text-xs text-[9px] rounded-full">
            프리미엄
          </Badge>
          <Badge variant="default" className="bg-black text-white md:px-3 py-2 md:text-xs text-[9px] rounded-full">
            골드
          </Badge>
          <Badge variant="default" className="bg-black text-white md:px-3 py-2 md:text-xs text-[9px] rounded-full">
            일반
          </Badge>
          <Badge variant="default" className="bg-black text-white md:px-3 py-2 md:text-xs text-[9px] rounded-full">
            개인
          </Badge>
        </div>
      </div>
      <img
        src="/assets/membership-file.png"
        alt="Membership Banner"
        className="block absolute right-0 bottom-0 w-40 md:w-60 h-auto object-cover"
      />
    </section>
  );
}
