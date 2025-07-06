"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { AuthAlertDialog } from "@/components/auth-alert-dialog";
import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { X } from "lucide-react";

interface UploadedFile {
  file: File;
  preview: string;
  name: string;
  size: string;
}

function FileUploadPageContent() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [vehicleRegistrations, setVehicleRegistrations] = useState<UploadedFile[]>([]);
  const [vehiclePhotos, setVehiclePhotos] = useState<UploadedFile[]>([]);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: '' as 'registration' | 'photo',
    index: -1,
  });

  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    file: null as UploadedFile | null,
  });

  const registrationInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) {
    return <AuthAlertDialog />;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleRegistrationUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newRegistrations = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: formatFileSize(file.size),
    }));
    
    setVehicleRegistrations([...vehicleRegistrations, ...newRegistrations]);
  };

  const handlePhotosUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: formatFileSize(file.size),
    }));
    
    // 최대 30개까지만 허용
    const totalPhotos = [...vehiclePhotos, ...newPhotos];
    if (totalPhotos.length > 30) {
      alert("차량 사진은 최대 30개까지만 첨부할 수 있습니다.");
      setVehiclePhotos(totalPhotos.slice(0, 30));
    } else {
      setVehiclePhotos(totalPhotos);
    }
  };

  const removeRegistration = (index: number) => {
    setDeleteDialog({
      open: true,
      type: 'registration',
      index,
    });
  };

  const removePhoto = (index: number) => {
    setDeleteDialog({
      open: true,
      type: 'photo',
      index,
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.type === 'registration') {
      const registrationToRemove = vehicleRegistrations[deleteDialog.index];
      URL.revokeObjectURL(registrationToRemove.preview);
      setVehicleRegistrations(vehicleRegistrations.filter((_, i) => i !== deleteDialog.index));
      if (registrationInputRef.current) {
        registrationInputRef.current.value = "";
      }
    } else if (deleteDialog.type === 'photo') {
      const photoToRemove = vehiclePhotos[deleteDialog.index];
      URL.revokeObjectURL(photoToRemove.preview);
      setVehiclePhotos(vehiclePhotos.filter((_, i) => i !== deleteDialog.index));
    }
    
    setDeleteDialog({ open: false, type: 'registration', index: -1 });
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, type: 'registration', index: -1 });
  };

  const openPreview = (file: UploadedFile) => {
    setPreviewDialog({ open: true, file });
  };

  const closePreview = () => {
    setPreviewDialog({ open: false, file: null });
  };

  const isFormValid = () => {
    return vehicleRegistrations.length > 0 && vehiclePhotos.length > 0;
  };

  const handleSubmit = async () => {
    if (!id || !isFormValid()) return;
    
    try {
      // TODO: 실제 파일 업로드 API 호출
      console.log("Uploading files:", {
        registrations: vehicleRegistrations,
        photos: vehiclePhotos,
      });
      
      // 완료 페이지로 이동
      router.push(`/register/complete?id=${id}`);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드에 실패했습니다. 다시 시도해주세요.");
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
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                2
              </div>
              <div className="w-24 h-px bg-gray-300"></div>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                3
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">
            마지막으로
            <br />
            차량 등록증과 사진을 등록해주세요.
          </h1>

          <div className="space-y-8">
            {/* 차량등록증 업로드 */}
            <div>
              <Label className="text-base font-medium">차량등록증</Label>
              
              {/* 차량등록증 업로드 영역 */}
              <div className="w-full border-2 border-dashed border-gray-300 rounded-lg mt-3">
                {/* 업로드된 차량등록증들 */}
                {vehicleRegistrations.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-2 p-3 border-gray-200">
                    {vehicleRegistrations.map((registration, index) => (
                      <div key={index} className="border-2 border-gray-200 rounded-lg p-2 flex items-center space-x-3 hover:bg-gray-50 hover:cursor-pointer">
                        <span className="icon-[heroicons-outline--paper-clip] text-xl" />
                        <div 
                          className="flex-1 min-w-0 w-full cursor-pointer rounded p-2 -m-2 transition-colors"
                          onClick={() => openPreview(registration)}
                        >
                          <div className="flex flex-row gap-3">
                            <p className="text-sm font-medium text-black truncate w-4/5">
                              {registration.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {registration.size}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeRegistration(index)}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 업로드 버튼 영역 */}
                <div
                  className="flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-50 transition-colors p-8"
                  onClick={() => registrationInputRef.current?.click()}
                >
                  <img
                    src="/assets/file_24x24.png"
                    alt="업로드 아이콘"
                    className="w-8 h-8 text-gray-400 mb-2"
                  />
                  <p className="text-gray-500 text-center">
                    차량등록증 첨부하기
                  </p>
                </div>
              </div>
              
              <input
                ref={registrationInputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleRegistrationUpload}
                className="hidden"
              />
            </div>

            {/* 차량 사진 업로드 */}
            <div>
              <Label className="text-base font-medium">차량 사진</Label>
              <p className="text-sm text-gray-500 mt-1">
                차량 사진은 최대 30개까지 첨부할 가능합니다.
              </p>

              {/* 차량 사진 업로드 영역 */}
              <div className="w-full border-2 border-dashed border-gray-300 rounded-lg mt-3">
                {/* 업로드된 사진들 */}
                {vehiclePhotos.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-2 p-3 border-b border-gray-200">
                    {vehiclePhotos.map((photo, index) => (
                      <div key={index} className="border-2 border-gray-200 rounded-lg p-2 flex items-center space-x-3 hover:bg-gray-50 hover:cursor-pointer">
                        <span className="icon-[heroicons-outline--paper-clip] text-xl" />
                        <div 
                          className="flex-1 min-w-0 w-full cursor-pointer rounded p-2 -m-2 transition-colors"
                          onClick={() => openPreview(photo)}
                        >
                          <div className="flex flex-row gap-3">
                            <p className="text-sm font-medium text-black truncate w-4/5">
                              {photo.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {photo.size}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeRegistration(index)}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 업로드 버튼 영역 */}
                <div
                  className="flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-50 transition-colors p-8"
                  onClick={() => photosInputRef.current?.click()}
                >
                  <img
                    src="/assets/file_24x24.png"
                    alt="업로드 아이콘"
                    className="w-8 h-8 text-gray-400 mb-2"
                  />
                  <p className="text-gray-500 text-center">
                    차량 사진 첨부하기
                  </p>
                </div>
              </div>
              
              <input
                ref={photosInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotosUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex space-x-4 mt-12">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => router.push(`/register/etc-info?id=${id}`)}
            >
              이전으로
            </Button>
            <Button
              type="button"
              className="grow"
              size="lg"
              disabled={!isFormValid()}
              onClick={handleSubmit}
            >
              등록하기
            </Button>
          </div>
        </div>
      </main>
      <BottomNavigation />
      
      {/* 파일 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>파일 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 파일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 파일 미리보기 다이얼로그 */}
      <AlertDialog open={previewDialog.open} onOpenChange={(open) => !open && closePreview()}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <span>파일 미리보기</span>
              {previewDialog.file && (
                <span className="text-sm font-normal text-gray-500">
                  ({previewDialog.file.size})
                </span>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className="truncate">
              {previewDialog.file?.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="flex-1 overflow-auto max-h-[60vh] flex items-center justify-center bg-gray-50 rounded-lg">
            {previewDialog.file && (
              <>
                {previewDialog.file.file.type.startsWith('image/') ? (
                  <img
                    src={previewDialog.file.preview}
                    alt={previewDialog.file.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : previewDialog.file.file.type === 'application/pdf' ? (
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-gray-600 mb-4">PDF 파일 미리보기</p>
                    <p className="text-sm text-gray-500">
                      PDF 파일은 브라우저에서 직접 열어보려면 다운로드가 필요합니다.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = previewDialog.file!.preview;
                        link.download = previewDialog.file!.name;
                        link.click();
                      }}
                    >
                      다운로드
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">📎</div>
                    <p className="text-gray-600">미리보기를 지원하지 않는 파일 형식입니다.</p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closePreview}>닫기</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function FileUploadPage() {
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
      <FileUploadPageContent />
    </Suspense>
  );
}