"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import { useAuthStore } from "@/store/auth";
import { AuthAlertDialog } from "@/components/auth-alert-dialog";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useVehicleEtcInfoForm } from "@/api/vehicle/form/useVehicleEtcInfoForm";
import {
  DRIVE_TYPES,
  TRANSMISSION_TYPES,
  COLORS,
  SPECIAL_USE_HISTORY,
  SPECIAL_MODIFICATION_HISTORY,
  OPTION_INFO,
} from "@/api/vehicle/form/vehicle-constants";

function EtcInfoPageContent() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const {
    form,
    handleSubmit,
    isLoading,
    isFormValid,
    isDirty,
  } = useVehicleEtcInfoForm(id ? Number(id) : null);

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

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                {/* Drive Type */}
                <FormField
                  control={form.control}
                  name="driveType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label className="text-lg">구동 방식</Label>
                      </FormLabel>
                      <Select 
                        key={field.value || "empty"}
                        onValueChange={(value) => field.onChange(value === "" ? undefined : value)} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="구동 방식 선택하기" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(DRIVE_TYPES).map(([key, label]) => (
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

                {/* Transmission */}
                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label className="text-lg">변속기</Label>
                      </FormLabel>
                      <Select 
                        key={field.value || "empty"}
                        onValueChange={(value) => field.onChange(value === "" ? undefined : value)} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="변속기 선택하기" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(TRANSMISSION_TYPES).map(([key, label]) => (
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

                {/* Color */}
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label className="text-lg">색상</Label>
                      </FormLabel>
                      <Select 
                        key={field.value || "empty"}
                        onValueChange={(value) => field.onChange(value === "" ? undefined : value)} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="색상 선택하기" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(COLORS).map(([key, label]) => (
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

                {/* Initial Registration Date */}
                <FormField
                  control={form.control}
                  name="initialRegistrationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label className="text-lg">최초 등록</Label>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "yyyy년 MM월 dd일")
                              ) : (
                                <span>날짜를 선택해주세요</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const dateStr = format(date, "yyyy-MM-dd");
                                field.onChange(dateStr);
                              } else {
                                field.onChange(undefined);
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1970-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Special Use History */}
                <FormField
                  control={form.control}
                  name="specialUseHistory"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        <Label className="text-lg">특수 사용 이력</Label>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value || ""}
                          className="flex gap-x-4 gap-y-1 flex-wrap"
                        >
                          {Object.entries(SPECIAL_USE_HISTORY).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value={key} 
                                id={`use-${key}`}
                                onClick={() => {
                                  const currentValue = field.value;
                                  const newValue = currentValue === key ? undefined : key;
                                  field.onChange(newValue);
                                }}
                              />
                              <Label htmlFor={`use-${key}`}>
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

                {/* Special Modification History */}
                <FormField
                  control={form.control}
                  name="specialModificationHistory"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        <Label className="text-lg">특수 개조 내역</Label>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value || ""}
                          className="flex gap-x-4 gap-y-1 flex-wrap"
                        >
                          {Object.entries(SPECIAL_MODIFICATION_HISTORY).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value={key} 
                                id={`mod-${key}`}
                                onClick={() => {
                                  const currentValue = field.value;
                                  const newValue = currentValue === key ? undefined : key;
                                  field.onChange(newValue);
                                }}
                              />
                              <Label htmlFor={`mod-${key}`}>
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

                {/* Option Info */}
                <FormField
                  control={form.control}
                  name="optionInfo"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        <Label className="text-lg">옵션 정보</Label>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value || ""}
                          className="flex gap-x-4 gap-y-1 flex-wrap"
                        >
                          {Object.entries(OPTION_INFO).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value={key} 
                                id={`option-${key}`}
                                onClick={() => {
                                  const currentValue = field.value;
                                  const newValue = currentValue === key ? undefined : key;
                                  field.onChange(newValue);
                                }}
                              />
                              <Label htmlFor={`option-${key}`}>
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
