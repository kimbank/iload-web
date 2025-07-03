"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import useAuthStore from "@/store/auth";
import { AuthAlertDialog } from "@/components/auth-alert-dialog";

export default function RegisterPage() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <AuthAlertDialog />;
  }

  const [formData, setFormData] = useState({
    manufacturer: "",
    vehicleType: "",
    displacement: "",
    seatingCapacity: "",
    fuel: "",
    vin1: "",
    vin2: "",
    country: "",
    trim: "",
    releasePrice: "",
    mileage: "",
    modelYear: "",
    manufacturingYear: "",
    accidentInfo: "",
    paintStatus: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value !== "");
  };

  const handleSubmit = async () => {
  }

  return (
    <div className="min-h-screen">
      <AppBar />
      <main className="flex-col justify-center items-center pt-14 pb-20">
        <div className="p-4">
          <div className="flex justify-center items-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                1
              </div>
              <div className="w-24 h-px bg-gray-300"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                2
              </div>
              <div className="w-24 h-px bg-gray-300"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                3
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">
            먼저 차량 기본 정보를
            <br />
            입력해주세요.
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "기아",
              "현대",
              "제네시스",
              "쉐보레",
              "르노코리아",
              "KG모빌리티",
              "기타",
            ].map((brand) => (
              <Button
                key={brand}
                variant={
                  formData.manufacturer === brand ? "default" : "outline"
                }
                onClick={() => handleChange("manufacturer", brand)}
                className={
                  formData.manufacturer === brand
                    ? "bg-black text-white"
                    : "bg-white text-black border-gray-300"
                }
              >
                {brand}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <Label>차량 유형</Label>
              <Select
                onValueChange={(value: string) =>
                  handleChange("vehicleType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="차량 유형 선택하기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">자동차</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="truck">트럭</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>배기량(CC)*</Label>
              <Select
                onValueChange={(value: string) =>
                  handleChange("displacement", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="배기량 선택하기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<1000">&lt; 1000cc (경형)</SelectItem>
                  <SelectItem value="1000-1600">
                    1000 - 1600cc 미만 (소형)
                  </SelectItem>
                  <SelectItem value="1600-2000">
                    1600 - 2000cc 미만 (중형)
                  </SelectItem>
                  <SelectItem value=">2000">&gt; 2000cc (대형)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>승차 인원*</Label>
              <Select
                onValueChange={(value: string) =>
                  handleChange("seatingCapacity", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="인원 선택하기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>연료*</Label>
              <Select onValueChange={(value: string) => handleChange("fuel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="연료 선택하기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">가솔린</SelectItem>
                  <SelectItem value="diesel">디젤</SelectItem>
                  <SelectItem value="lpg">LPG</SelectItem>
                  <SelectItem value="electric">전기</SelectItem>
                  <SelectItem value="hybrid">하이브리드</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>차대번호</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="KMHHT61DP5U123456"
                  onChange={(e) => handleChange("vin1", e.target.value)}
                />
                <Input
                  placeholder="123가 4567"
                  onChange={(e) => handleChange("vin2", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>제조국가</Label>
              <Select
                onValueChange={(value: string) => handleChange("country", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="제조사 선택하기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="korea">한국</SelectItem>
                  <SelectItem value="usa">미국</SelectItem>
                  <SelectItem value="germany">독일</SelectItem>
                  <SelectItem value="japan">일본</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>차량등급</Label>
              <Input
                placeholder="노블레스"
                onChange={(e) => handleChange("trim", e.target.value)}
              />
            </div>
            <div>
              <Label>출고가격*</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="2200"
                  onChange={(e) =>
                    handleChange("releasePrice", e.target.value)
                  }
                  className="pr-12"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  만원
                </span>
              </div>
            </div>
            <div>
              <Label>주행거리*</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="60000"
                  onChange={(e) => handleChange("mileage", e.target.value)}
                  className="pr-10"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  km
                </span>
              </div>
            </div>
            <div>
              <Label>연식*</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="2023"
                  onChange={(e) => handleChange("modelYear", e.target.value)}
                  className="pr-10"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  년도
                </span>
              </div>
            </div>
            <div>
              <Label>제조년도</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="2022"
                  onChange={(e) =>
                    handleChange("manufacturingYear", e.target.value)
                  }
                  className="pr-10"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  년도
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <Label>사고정보*</Label>
              <RadioGroup
                className="flex gap-4"
                onValueChange={(value: string) =>
                  handleChange("accidentInfo", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="total-loss" id="r1" />
                  <Label htmlFor="r1">전손 보험사고</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flood" id="r2" />
                  <Label htmlFor="r2">침수 보험사고</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="theft" id="r3" />
                  <Label htmlFor="r3">도난 보험사고</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="col-span-2">
              <Label>도색여부*</Label>
              <RadioGroup
                className="flex gap-4"
                onValueChange={(value: string) =>
                  handleChange("paintStatus", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="p1" />
                  <Label htmlFor="p1">무도색</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="simple" id="p2" />
                  <Label htmlFor="p2">단순도색</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="panel" id="p3" />
                  <Label htmlFor="p3">판금도색</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="restored" id="p4" />
                  <Label htmlFor="p4">복원도색</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <span className="flex flex-row gap-2 w-full mt-4">
            <Button
              className="mt-8"
              variant="secondary"
              size="lg"
              onClick={() => window.history.back()}
            >
              이전으로
            </Button>
            <Button
              className="grow mt-8"
              size="lg"
              disabled={!isFormValid()}
              onClick={handleSubmit}
            >
              다음으로
            </Button>
          </span>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
