import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import Divider from "@/components/divider";
import BannerCarousel from "./banner-carousel";
import GridList from "./grid-list";
import VerticalList from "./vertical-list";

export default function Home() {
  return (
    <div className="min-h-screen">
      <AppBar />
      <main className="flex-col justify-center items-center pt-14 pb-20">
        {/* 배너 캐로셀 */}
        <BannerCarousel />

        <section className="p-6">
          {/* 최근 등록한 차량 */}
          <GridList title={"최근 등록한 차량"} type={"recent-added"} />
          <Divider className="my-14 -mx-6" />

          {/* 지금 가장 가격이 높은 차량이에요. */}
          <GridList
            title={"지금 가장 가격이 높은 차량이에요."}
            type={"high-price"}
          />
          <Divider className="my-14 -mx-6" />

          {/* 무사고, 무도색 차량이에요. */}
          <VerticalList title={"무사고, 무도색 차량이에요."} />
        </section>
      </main>
      <BottomNavigation />
    </div>
  );
}
