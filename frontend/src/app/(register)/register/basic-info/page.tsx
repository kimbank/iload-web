"use client";

import { Button } from "@/components/ui/button";
import { LabelRequired as Label } from "@/components/label-required";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/NumberInput";
import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import { useAuthStore } from "@/store/auth";
import { AuthAlertDialog } from "@/components/auth-alert-dialog";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useVehicleBasicInfoForm } from "@/api/vehicle/useVehicleBasicInfoForm";
import {
  MANUFACTURERS,
  VEHICLE_TYPES,
  FUEL_TYPES,
  MANUFACTURE_COUNTRIES,
  ACCIDENT_INFO,
  REPAINTED_TYPES,
  MANUFACTURER_LABELS,
  VEHICLE_TYPE_LABELS,
  FUEL_TYPE_LABELS,
  MANUFACTURE_COUNTRY_LABELS,
  ACCIDENT_INFO_LABELS,
  REPAINTED_TYPE_LABELS,
} from "@/api/vehicle/form/vehicle-constants";

function RegisterPageContent() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  
  // SOTA 폼 관리 패턴 적용
  const {
    form,
    handleSubmit,
    isLoading,
    isFormValid,
    isDirty,
  } = useVehicleBasicInfoForm(id ? Number(id) : null);

  if (!isAuthenticated) {
    return <AuthAlertDialog />;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;
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

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Manufacturer Selection */}
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {Object.entries(MANUFACTURERS).map(([key, value]) => (
                        <Button
                          key={value}
                          type="button"
                          variant={field.value === value ? "default" : "outline"}
                          onClick={() => field.onChange(value)}
                          className={
                            field.value === value
                              ? "bg-black text-white"
                              : "bg-white text-black border-gray-300"
                          }
                        >
                          {MANUFACTURER_LABELS[key as keyof typeof MANUFACTURER_LABELS]}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                {/* Vehicle Type */}
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>차량 유형</FormLabel>
                      <Select 
                        key={field.value || "empty"} // 강제 리렌더링을 위한 key
                        onValueChange={(value) => {
                          console.log("🔍 Vehicle Type changed:", value, "Current field value:", field.value);
                          field.onChange(value === "" ? undefined : value);
                        }} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="차량 유형 선택하기" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(VEHICLE_TYPES).map(([key, value]) => (
                            <SelectItem key={value} value={value}>
                              {VEHICLE_TYPE_LABELS[key as keyof typeof VEHICLE_TYPE_LABELS]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Displacement */}
                <FormField
                  control={form.control}
                  name="displacement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label required>배기량(CC)</Label>
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="1600"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Seater Count */}
                <FormField
                  control={form.control}
                  name="seaterCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label required>승차 인원</Label>
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fuel Type */}
                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label required>연료</Label>
                      </FormLabel>
                      <Select 
                        key={field.value || "empty"} // 강제 리렌더링을 위한 key
                        onValueChange={(value) => field.onChange(value === "" ? undefined : value)} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="연료 선택하기" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(FUEL_TYPES).map(([key, value]) => (
                            <SelectItem key={value} value={value}>
                              {FUEL_TYPE_LABELS[key as keyof typeof FUEL_TYPE_LABELS]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vehicle Code */}
                <FormField
                  control={form.control}
                  name="vehicleCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>차대번호</FormLabel>
                      <FormControl>
                        <Input placeholder="KMHHT61DP5U123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vehicle Number */}
                <FormField
                  control={form.control}
                  name="vehicleNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>차량번호</FormLabel>
                      <FormControl>
                        <Input placeholder="123가 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Manufacture Country */}
                <FormField
                  control={form.control}
                  name="manufactureCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제조국가</FormLabel>
                      <Select 
                        key={field.value || "empty"} // 강제 리렌더링을 위한 key
                        onValueChange={(value) => field.onChange(value === "" ? undefined : value)} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="제조국가 선택하기" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(MANUFACTURE_COUNTRIES).map(([key, value]) => (
                            <SelectItem id={value} key={value} value={value}>
                              {MANUFACTURE_COUNTRY_LABELS[key as keyof typeof MANUFACTURE_COUNTRY_LABELS]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vehicle Grade */}
                <FormField
                  control={form.control}
                  name="vehicleGrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>차량등급</FormLabel>
                      <FormControl>
                        <Input placeholder="노블레스" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Release Price */}
                <FormField
                  control={form.control}
                  name="releasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label required>출고가격</Label>
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="2200"
                          suffix="만원"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mileage */}
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label required>주행거리</Label>
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="60000"
                          suffix="km"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Release Year */}
                <FormField
                  control={form.control}
                  name="releaseYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label required>연식</Label>
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="2023"
                          suffix="년도"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Manufacture Year */}
                <FormField
                  control={form.control}
                  name="manufactureYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제조년도</FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="2022"
                          suffix="년도"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Accident Info */}
                <FormField
                  control={form.control}
                  name="accidentInfo"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        <Label required>사고정보</Label>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === "" ? undefined : value)}
                          value={field.value || ""}
                          className="flex gap-4"
                        >
                          {Object.entries(ACCIDENT_INFO).map(([key, value]) => (
                            <div key={value} className="flex items-center space-x-2">
                              <RadioGroupItem value={value} id={`accident-${value}`} />
                              <Label htmlFor={`accident-${value}`}>
                                {ACCIDENT_INFO_LABELS[key as keyof typeof ACCIDENT_INFO_LABELS]}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Repainted */}
                <FormField
                  control={form.control}
                  name="repainted"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        <Label required>도색여부</Label>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === "" ? undefined : value)}
                          value={field.value || ""}
                          className="flex gap-4"
                        >
                          {Object.entries(REPAINTED_TYPES).map(([key, value]) => (
                            <div key={value} className="flex items-center space-x-2">
                              <RadioGroupItem value={value} id={`repainted-${value}`} />
                              <Label htmlFor={`repainted-${value}`}>
                                {REPAINTED_TYPE_LABELS[key as keyof typeof REPAINTED_TYPE_LABELS]}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <span className="flex flex-row gap-2 w-full mt-4">
                <Button
                  type="button"
                  className="mt-8"
                  variant="secondary"
                  size="lg"
                  onClick={() => router.back()}
                >
                  이전으로
                </Button>
                <Button
                  type="submit"
                  className="grow mt-8"
                  size="lg"
                  disabled={!isFormValid}
                >
                  다음으로
                </Button>
              </span>
            </form>
          </Form>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

export default function RegisterPage() {
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
      <RegisterPageContent />
    </Suspense>
  );
}
