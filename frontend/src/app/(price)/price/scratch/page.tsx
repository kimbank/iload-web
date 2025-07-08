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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NumberInput } from "@/components/NumberInput";
import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import { useRouter } from "next/navigation";
import { usePriceScratchForm } from "@/api/price/form/usePriceScratchForm";
import { usePriceScratchStore } from "@/store/price-scratch";
import { useEffect } from "react";
import {
  MANUFACTURERS,
  VEHICLE_TYPES,
  FUEL_TYPES,
  ACCIDENT_INFO,
  REPAINTED_TYPES,
} from "@/api/vehicle/form/vehicle-constants";

export default function ScratchPage() {
  const router = useRouter();
  const { error, formData } = usePriceScratchStore();
  
  const {
    form,
    handleSubmit,
    isFormValid,
    isDirty,
  } = usePriceScratchForm();

  // 컴포넌트 마운트 시 기존 폼 데이터로 초기화
  useEffect(() => {
    if (formData) {
      form.reset(formData);
    }
  }, [formData, form]);

  return (
    <div className="min-h-screen bg-white">
      <AppBar />

      <main className="pt-14 pb-20 px-4">
        <div className="my-4">
          <p className="text-2xl font-semibold">
            미등록 차량의 <br />
            간단 정보를 입력해주세요
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Manufacturer Selection */}
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(MANUFACTURERS).map(([key, label]) => (
                      <Button
                        key={key}
                        type="button"
                        variant={field.value === key ? "default" : "outline"}
                        onClick={() => field.onChange(key)}
                        className={
                          field.value === key
                            ? "bg-black text-white"
                            : "bg-white text-black border-gray-300"
                        }
                      >
                        {label}
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
                    <Label className="text-lg">차량 유형</Label>
                    <Select 
                      key={field.value || "empty"}
                      onValueChange={(value) => {
                        field.onChange(value === "" ? undefined : value);
                      }} 
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="자동차" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(VEHICLE_TYPES).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
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
                      <Label className="text-lg" required>배기량(CC)</Label>
                    </FormLabel>
                    <FormControl>
                      <NumberInput
                        placeholder="1000 - 1600cc 미만 (소형)"
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
                      <Label className="text-lg" required>승차 인원</Label>
                    </FormLabel>
                    <FormControl>
                      <NumberInput
                        placeholder="4"
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
                      <Label className="text-lg" required>연료</Label>
                    </FormLabel>
                    <Select 
                      key={field.value || "empty"}
                      onValueChange={(value) => field.onChange(value === "" ? undefined : value)} 
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="가솔린" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(FUEL_TYPES).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Label className="text-lg" required>출고가격</Label>
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
                      <Label className="text-lg" required>주행거리</Label>
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
                      <Label className="text-lg" required>연식</Label>
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
                    <Label className="text-lg">제조년도</Label>
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
                      <Label className="text-xl" required>사고정보</Label>
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-4">
                        {Object.entries(ACCIDENT_INFO).map(([key, label]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`accident-${key}`}
                              checked={field.value?.includes(key) || false}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), key]);
                                } else {
                                  field.onChange(field.value?.filter((item: string) => item !== key) || []);
                                }
                              }}
                            />
                            <Label htmlFor={`accident-${key}`}>
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
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
                      <Label className="text-xl" required>도색여부</Label>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "" ? undefined : value)}
                        value={field.value || ""}
                        className="flex gap-4 flex-wrap"
                      >
                        {Object.entries(REPAINTED_TYPES).map(([key, label]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <RadioGroupItem value={key} id={`repainted-${key}`} />
                            <Label htmlFor={`repainted-${key}`}>
                              {label}
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
                onClick={() => router.push("/price")}
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
      </main>

      <BottomNavigation />
    </div>
  );
}