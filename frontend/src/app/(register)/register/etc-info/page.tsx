"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { AuthAlertDialog } from "@/components/auth-alert-dialog";
import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function EtcInfoPage() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <AuthAlertDialog />;
  }

  const [formData, setFormData] = useState({
    drivingSystem: "",
    transmission: "",
    color: "",
    firstRegistrationDate: "",
    specialUseHistory: "",
    specialModificationHistory: "",
    options: [] as string[],
  });

  const handleChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (option: string) => {
    setFormData((prev) => {
      const newOptions = prev.options.includes(option)
        ? prev.options.filter((item) => item !== option)
        : [...prev.options, option];
      return { ...prev, options: newOptions };
    });
  };

  const isFormValid = () => {
    return (
      formData.drivingSystem &&
      formData.transmission &&
      formData.color &&
      formData.firstRegistrationDate &&
      formData.specialUseHistory &&
      formData.specialModificationHistory &&
      formData.options.length > 0
    );
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
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                1
              </div>
              <div className="w-24 h-px bg-gray-300"></div>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                2
              </div>
              <div className="w-24 h-px bg-gray-300"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                3
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">
            차량 운행 정보와
            <br />
            기타 정보를 입력해주세요.
          </h1>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <Label>구동 방식</Label>
              <Select
                onValueChange={(value) => handleChange("drivingSystem", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="2WD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2wd">2WD</SelectItem>
                  <SelectItem value="4wd">4WD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>변속기</Label>
              <Select
                onValueChange={(value) => handleChange("transmission", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="A/T" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="at">A/T</SelectItem>
                  <SelectItem value="mt">M/T</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>색상</Label>
              <Select onValueChange={(value) => handleChange("color", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="블랙" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">블랙</SelectItem>
                  <SelectItem value="white">화이트</SelectItem>
                  <SelectItem value="silver">실버</SelectItem>
                  <SelectItem value="gray">그레이</SelectItem>
                  <SelectItem value="red">레드</SelectItem>
                  <SelectItem value="blue">블루</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>최초 등록</Label>
              <Input
                type="text"
                placeholder="20250701"
                onChange={(e) =>
                  handleChange("firstRegistrationDate", e.target.value)
                }
              />
            </div>
            <div className="col-span-2">
              <Label>특수 사용 이력</Label>
              <RadioGroup
                className="flex gap-4"
                onValueChange={(value) =>
                  handleChange("specialUseHistory", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rental" id="rental" />
                  <Label htmlFor="rental">대여 용도</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="commercial" id="commercial" />
                  <Label htmlFor="commercial">영업 용도</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="official" id="official" />
                  <Label htmlFor="official">관용 용도</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="col-span-2">
              <Label>특수 개조 내역</Label>
              <RadioGroup
                className="flex gap-4"
                onValueChange={(value) =>
                  handleChange("specialModificationHistory", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fuel" id="fuel" />
                  <Label htmlFor="fuel">연료 개조</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="seat" id="seat" />
                  <Label htmlFor="seat">좌석 개조</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="col-span-2">
              <Label>옵션 정보</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sunroof"
                    onCheckedChange={() => handleOptionChange("sunroof")}
                  />
                  <Label htmlFor="sunroof">선루프</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="side-step"
                    onCheckedChange={() => handleOptionChange("side-step")}
                  />
                  <Label htmlFor="side-step">사이드스텝</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smart-key"
                    onCheckedChange={() => handleOptionChange("smart-key")}
                  />
                  <Label htmlFor="smart-key">스마트키</Label>
                </div>
              </div>
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
