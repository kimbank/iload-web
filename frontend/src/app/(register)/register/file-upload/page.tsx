"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { AuthAlertDialog } from "@/components/auth-alert-dialog";
import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import RegisterStep from "../register-step";
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
import { uploadVehicleRegistrationCertificate, deleteVehicleRegistrationCertificate } from "@/api/file-upload/certificates";
import { uploadVehiclePhoto, deleteVehiclePhoto } from "@/api/file-upload/photos";
import { useVehicleRegistrationCertificates } from "@/api/file-upload/useVehicleRegistrationCertificates";
import { useVehiclePhotos } from "@/api/file-upload/useVehiclePhotos";

interface UploadedFile {
  id?: number;
  file?: File;
  preview?: string;
  name: string;
  size: string;
  fileUrl?: string;
  isUploaded?: boolean;
}

function FileUploadPageContent() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const vehicleId = id ? parseInt(id) : 0;

  // 서버에서 기존 파일 목록 조회
  const { data: existingCertificates, mutate: mutateCertificates } = useVehicleRegistrationCertificates(vehicleId);
  const { data: existingPhotos, mutate: mutatePhotos } = useVehiclePhotos(vehicleId);

  // 새로 업로드할 파일들
  const [newVehicleRegistrations, setNewVehicleRegistrations] = useState<UploadedFile[]>([]);
  const [newVehiclePhotos, setNewVehiclePhotos] = useState<UploadedFile[]>([]);

  // 서버 파일들을 로컬 상태로 변환
  const [vehicleRegistrations, setVehicleRegistrations] = useState<UploadedFile[]>([]);
  const [vehiclePhotos, setVehiclePhotos] = useState<UploadedFile[]>([]);

  // 업로드 상태
  const [uploading, setUploading] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: '' as 'registration' | 'photo',
    index: -1,
    fileId: undefined as number | undefined,
  });

  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    file: null as UploadedFile | null,
  });

  const registrationInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  // 서버 데이터를 로컬 상태로 변환
  useEffect(() => {
    if (existingCertificates) {
      const converted = existingCertificates.map(cert => ({
        id: cert.id,
        name: cert.fileName || 'Unknown',
        size: cert.fileSize ? formatFileSize(cert.fileSize) : '0 KB',
        fileUrl: cert.fileUrl,
        isUploaded: true,
      }));
      setVehicleRegistrations([...converted, ...newVehicleRegistrations]);
    }
  }, [existingCertificates]);

  useEffect(() => {
    if (existingPhotos) {
      const converted = existingPhotos.map(photo => ({
        id: photo.id,
        name: photo.fileName || 'Unknown',
        size: photo.fileSize ? formatFileSize(photo.fileSize) : '0 KB',
        fileUrl: photo.fileUrl,
        isUploaded: true,
      }));
      setVehiclePhotos([...converted, ...newVehiclePhotos]);
    }
  }, [existingPhotos]);

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

  const handleRegistrationUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !vehicleId) return;

    setUploading(true);
    
    try {
      for (const file of files) {
        await uploadVehicleRegistrationCertificate(vehicleId, file);
      }
      
      // 업로드 성공 후 서버 데이터 다시 가져오기
      await mutateCertificates();
      
      // 입력 필드 초기화
      if (registrationInputRef.current) {
        registrationInputRef.current.value = "";
      }
    } catch (error) {
      console.error("차량 등록증 업로드 실패:", error);
      alert("차량 등록증 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotosUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !vehicleId) return;

    // 최대 30개 체크
    const currentPhotoCount = vehiclePhotos.length;
    if (currentPhotoCount + files.length > 30) {
      alert("차량 사진은 최대 30개까지만 첨부할 수 있습니다.");
      return;
    }

    setUploading(true);
    
    try {
      for (const file of files) {
        await uploadVehiclePhoto(vehicleId, file);
      }
      
      // 업로드 성공 후 서버 데이터 다시 가져오기
      await mutatePhotos();
      
      // 입력 필드 초기화
      if (photosInputRef.current) {
        photosInputRef.current.value = "";
      }
    } catch (error) {
      console.error("차량 사진 업로드 실패:", error);
      alert("차량 사진 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  };

  const removeRegistration = (index: number) => {
    const file = vehicleRegistrations[index];
    setDeleteDialog({
      open: true,
      type: 'registration',
      index,
      fileId: file.id,
    });
  };

  const removePhoto = (index: number) => {
    const file = vehiclePhotos[index];
    setDeleteDialog({
      open: true,
      type: 'photo',
      index,
      fileId: file.id,
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.fileId) return;

    try {
      setUploading(true);
      
      if (deleteDialog.type === 'registration') {
        await deleteVehicleRegistrationCertificate(deleteDialog.fileId);
        await mutateCertificates();
      } else if (deleteDialog.type === 'photo') {
        await deleteVehiclePhoto(deleteDialog.fileId);
        await mutatePhotos();
      }
      
      setDeleteDialog({ open: false, type: 'registration', index: -1, fileId: undefined });
    } catch (error) {
      console.error("파일 삭제 실패:", error);
      alert("파일 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, type: 'registration', index: -1, fileId: undefined });
  };

  const openPreview = (file: UploadedFile) => {
    setPreviewDialog({ open: true, file });
  };

  const closePreview = () => {
    setPreviewDialog({ open: false, file: null });
  };

  const handleSubmit = async () => {
    if (!vehicleId) return;
    
    try {
      // 모든 파일이 업로드되었는지 확인
      if (uploading) {
        alert("파일 업로드가 진행 중입니다. 잠시 후 다시 시도해주세요.");
        return;
      }
      
      // 완료 페이지로 이동
      router.push(`/register/complete?id=${vehicleId}`);
    } catch (error) {
      console.error("등록 완료 실패:", error);
      alert("등록 완료에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen">
      <AppBar />
      <main className="flex-col justify-center items-center pt-14 pb-20">
        <div className="p-4">
          <RegisterStep id={Number(id)} step={3} />

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
                            <p className="text-sm font-medium text-black truncate w-full grow">
                              {registration.name}
                            </p>
                            <p className="text-sm mr-2 text-gray-500 min-w-fit">
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
                            <p className="text-sm font-medium text-black truncate w-full grow">
                              {photo.name}
                            </p>
                            <p className="text-sm mr-2 text-gray-500 min-w-fit">
                              {photo.size}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removePhoto(index)}
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
              onClick={() => router.push(`/register/etc-info?id=${vehicleId}`)}
            >
              이전으로
            </Button>
            <Button
              type="button"
              className="grow"
              size="lg"
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? "업로드 중..." : "등록하기"}
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
                {previewDialog.file.isUploaded ? (
                  // 서버에서 온 파일은 URL로 표시
                  previewDialog.file.fileUrl ? (
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">📄</div>
                      <p className="text-gray-600 mb-4">파일 미리보기</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {previewDialog.file.name}
                      </p>
                      <Button
                        onClick={() => {
                          window.open(previewDialog.file!.fileUrl, '_blank');
                        }}
                      >
                        파일 보기
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">📎</div>
                      <p className="text-gray-600">파일을 불러올 수 없습니다.</p>
                    </div>
                  )
                ) : (
                  // 새로 업로드된 파일은 기존 로직 사용
                  <>
                    {previewDialog.file.file?.type.startsWith('image/') ? (
                      <img
                        src={previewDialog.file.preview}
                        alt={previewDialog.file.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : previewDialog.file.file?.type === 'application/pdf' ? (
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
                            link.href = previewDialog.file!.preview || '';
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