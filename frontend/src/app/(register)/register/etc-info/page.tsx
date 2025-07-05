"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useVehicle } from "@/api/vehicle/useVehicle";
import { putVehicleEtcInfo, VehicleRegistrationEtcInfoRequest } from "@/api/vehicle/putVehicleEtcInfo";

function EtcInfoPageContent() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const { data: vehicleData, isLoading, mutate } = useVehicle(Number(id));

  const [formData, setFormData] = useState<Partial<VehicleRegistrationEtcInfoRequest>>({
    driveType: undefined,
    transmission: undefined,
    color: undefined,
    initialRegistrationDate: "",
    specialUseHistory: undefined,
    specialModificationHistory: undefined,
    optionInfo: undefined,
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (vehicleData && !isLoading && id) {
      setFormData({
        driveType: vehicleData.driveType as any,
        transmission: vehicleData.transmission as any,
        color: vehicleData.color as any,
        initialRegistrationDate: vehicleData.initialRegistrationDate,
        specialUseHistory: vehicleData.specialUseHistory as any,
        specialModificationHistory: vehicleData.specialModificationHistory as any,
        optionInfo: vehicleData.optionInfo as any,
      });
      
      // Parse the existing date if it exists
      if (vehicleData.initialRegistrationDate) {
        try {
          // If the date is in YYYYMMDD format, parse it
          const dateStr = vehicleData.initialRegistrationDate;
          if (dateStr.length === 8) {
            const year = parseInt(dateStr.substring(0, 4));
            const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
            const day = parseInt(dateStr.substring(6, 8));
            setSelectedDate(new Date(year, month, day));
          } else {
            // Try to parse as ISO date string
            setSelectedDate(new Date(dateStr));
          }
        } catch (error) {
          console.error("Error parsing date:", error);
        }
      }
    }
  }, [vehicleData, isLoading, id]);

  if (!isAuthenticated) {
    return <AuthAlertDialog />;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;
  }

  const handleChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // Format date as ISO string for LocalDateTime compatibility
      const isoString = date.toISOString();
      setFormData((prev) => ({ ...prev, initialRegistrationDate: isoString }));
    } else {
      setFormData((prev) => ({ ...prev, initialRegistrationDate: "" }));
    }
  };

  const isFormValid = () => {
    return (
      formData.driveType &&
      formData.transmission &&
      formData.color &&
      selectedDate && // Check if date is selected
      formData.specialUseHistory &&
      formData.specialModificationHistory &&
      formData.optionInfo
    );
  };

  const handleSubmit = async () => {
    if (!id || !isFormValid()) return;
    
    try {
      await putVehicleEtcInfo(Number(id), formData as VehicleRegistrationEtcInfoRequest);
      // Navigate to next step or completion page
      router.push(`/register/complete?id=${id}`);
    } catch (error) {
      console.error("Failed to update etc info", error);
    } finally {
      // Optionally, you can refresh the vehicle data after submission
      mutate();
    }
  };

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
                value={formData.driveType}
                onValueChange={(value) => handleChange("driveType", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="2WD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TWO_WD">2WD</SelectItem>
                  <SelectItem value="FOUR_WD">4WD</SelectItem>
                  <SelectItem value="AWD">AWD</SelectItem>
                  <SelectItem value="FF">FF</SelectItem>
                  <SelectItem value="FR">FR</SelectItem>
                  <SelectItem value="OTHER">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>변속기</Label>
              <Select
                value={formData.transmission}
                onValueChange={(value) => handleChange("transmission", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="A/T" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUTOMATIC">A/T</SelectItem>
                  <SelectItem value="MANUAL">M/T</SelectItem>
                  <SelectItem value="OTHER">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>색상</Label>
              <Select value={formData.color} onValueChange={(value) => handleChange("color", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="블랙" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BLACK">블랙</SelectItem>
                  <SelectItem value="WHITE">화이트</SelectItem>
                  <SelectItem value="SILVER">실버</SelectItem>
                  <SelectItem value="GRAY">그레이</SelectItem>
                  <SelectItem value="RED">레드</SelectItem>
                  <SelectItem value="BLUE">블루</SelectItem>
                  <SelectItem value="YELLOW">옐로우</SelectItem>
                  <SelectItem value="GREEN">그린</SelectItem>
                  <SelectItem value="OTHER">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>최초 등록</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    {selectedDate ? (
                      format(selectedDate, "yyyy년 MM월 dd일")
                    ) : (
                      <span>날짜를 선택해주세요</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1970-01-01")
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-2">
              <Label>특수 사용 이력</Label>
              <RadioGroup
                className="flex gap-4"
                value={formData.specialUseHistory}
                onValueChange={(value) =>
                  handleChange("specialUseHistory", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="RENTAL" id="rental" />
                  <Label htmlFor="rental">대여 용도</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="COMMERCIAL" id="commercial" />
                  <Label htmlFor="commercial">영업 용도</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OFFICIAL" id="official" />
                  <Label htmlFor="official">관용 용도</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OTHER" id="other-use" />
                  <Label htmlFor="other-use">기타</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="col-span-2">
              <Label>특수 개조 내역</Label>
              <RadioGroup
                className="flex gap-4"
                value={formData.specialModificationHistory}
                onValueChange={(value) =>
                  handleChange("specialModificationHistory", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FUEL_MODIFICATION" id="fuel" />
                  <Label htmlFor="fuel">연료 개조</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SEAT_MODIFICATION" id="seat" />
                  <Label htmlFor="seat">좌석 개조</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ENGINE_MODIFICATION" id="engine" />
                  <Label htmlFor="engine">엔진 개조</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OTHER" id="other-mod" />
                  <Label htmlFor="other-mod">기타</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="col-span-2">
              <Label>옵션 정보</Label>
              <RadioGroup
                className="flex gap-4"
                value={formData.optionInfo}
                onValueChange={(value) => handleChange("optionInfo", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SUNROOF" id="sunroof" />
                  <Label htmlFor="sunroof">선루프</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SIDE_STEP" id="side-step" />
                  <Label htmlFor="side-step">사이드스텝</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SMART_KEY" id="smart-key" />
                  <Label htmlFor="smart-key">스마트키</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OTHER" id="other-option" />
                  <Label htmlFor="other-option">기타</Label>
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

export default function EtcInfoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <AppBar />
        <main className="flex-col justify-center items-center pt-14 pb-20">
          <div className="p-4 text-center">
            <p>로딩 중...</p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    }>
      <EtcInfoPageContent />
    </Suspense>
  );
}
