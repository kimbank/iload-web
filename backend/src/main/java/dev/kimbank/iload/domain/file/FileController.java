package dev.kimbank.iload.domain.file;

import dev.kimbank.iload.domain.file.dto.RegisteredVehicleFileSummaryResponse;
import dev.kimbank.iload.global.security.AuthedUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
@Slf4j
@Tag(name="File", description = "차량 사진, 등록증 관련")
class FileController {
    private final FileService fileService;

    @GetMapping("/photos")
    @Operation(summary = "차량 사진 조회",
            description = "사용자의 차량 ID를 기반으로 등록된 차량 사진 목록을 조회합니다.")
    public List<RegisteredVehicleFileSummaryResponse> findRegisteredVehiclePhotos(
            @AuthedUser Long userId, @RequestParam Long vehicleId) {
        return fileService.getRegisteredVehiclePhotos(userId, vehicleId);
    }

    @GetMapping("/certificates")
    @Operation(summary = "차량 등록증 조회",
            description = "사용자의 차량 ID를 기반으로 등록된 차량 등록증 목록을 조회합니다.")
    public List<RegisteredVehicleFileSummaryResponse> findVehicleRegistrationCertificates(
            @AuthedUser Long userId, @RequestParam Long vehicleId) {
        return fileService.getVehicleRegistrationCertificates(userId, vehicleId);
    }

    @PostMapping(path = "/photos",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "차량 사진 업로드",
            description = "사용자의 차량 ID를 기반으로 차량 사진을 업로드합니다.")
    public void uploadRegisteredVehiclePhoto(
            @AuthedUser Long userId, @RequestParam Long vehicleId, @RequestPart("file") MultipartFile file) {
        fileService.uploadRegisteredVehiclePhoto(userId, vehicleId, file);
    }

    @PostMapping("/certificates")
    @Operation(summary = "차량 등록증 업로드",
            description = "사용자의 차량 ID를 기반으로 차량 등록증을 업로드합니다.")
    public void uploadVehicleRegistrationCertificate(
            @AuthedUser Long userId, @RequestParam Long vehicleId, @RequestPart("file") MultipartFile file) {
        fileService.uploadVehicleRegistrationCertificate(userId, vehicleId, file);
    }

    @DeleteMapping("/photos")
    @Operation(summary = "차량 사진 삭제",
            description = "사용자의 차량 ID와 사진 ID를 기반으로 등록된 차량 사진을 삭제합니다.")
    public void deleteRegisteredVehiclePhoto(
            @AuthedUser Long userId, @RequestParam Long photoId) {
        fileService.deleteRegisteredVehiclePhoto(userId, photoId);
    }

    @DeleteMapping("/certificates")
    @Operation(summary = "차량 등록증 삭제",
            description = "사용자의 차량 ID와 등록증 ID를 기반으로 등록된 차량 등록증을 삭제합니다.")
    public void deleteVehicleRegistrationCertificate(
            @AuthedUser Long userId, @RequestParam Long certificateId) {
        fileService.deleteVehicleRegistrationCertificate(userId, certificateId);
    }
}
