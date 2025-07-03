"use client";

import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import Divider from "@/components/divider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

// Mock data for demonstration
const inProgressCars = [
  {
    id: 1,
    name: "기아 K5",
    step: 1,
    totalSteps: 3,
    imageUrl: "/banner/example.png",
  },
];

const completedCars = [
  {
    id: 2,
    name: "현대 아반떼",
    carNumber: "12가 3456",
    price: "2,500만원",
    imageUrl: "/banner/example.png",
  },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <AppBar />
      <main className="flex-col justify-center items-center pt-14 pb-20">
        <section className="p-6">
          <Link href="/register/basic-info" passHref>
            <Button className="w-full" size="lg">
              + 새로운 차량 등록하기
            </Button>
          </Link>
        </section>

        <Divider />

        <section className="p-6">
          <h2 className="text-xl font-bold mb-4">작성중인 차량</h2>
          {inProgressCars.length > 0 ? (
            inProgressCars.map((car) => (
              <Card key={car.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{car.name}</CardTitle>
                  <CardDescription>
                    {car.step}/{car.totalSteps} 단계 진행중
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <Image
                    src={car.imageUrl}
                    alt={car.name}
                    width={300}
                    height={200}
                    className="rounded-md w-full"
                  /> */}
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/register/basic-info?id=${car.id}`}
                    passHref
                    className="w-full"
                  >
                    <Button className="w-full">이어서 작성하기</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">작성중인 차량이 없습니다.</p>
          )}
        </section>
      </main>
      <BottomNavigation />
    </div>
  );
}
