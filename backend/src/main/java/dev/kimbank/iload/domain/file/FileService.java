package dev.kimbank.iload.domain.file;

import dev.kimbank.iload.domain.file.dto.RegisteredVehicleFileSummaryResponse;
import dev.kimbank.iload.domain.file.entity.RegisteredVehiclePhoto;
import dev.kimbank.iload.domain.file.entity.VehicleRegistrationCertificate;
import dev.kimbank.iload.domain.file.repository.RegisteredVehiclePhotoRepository;
import dev.kimbank.iload.domain.file.repository.VehicleRegistrationCertificateRepository;
import dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle;
import dev.kimbank.iload.domain.vehicle.repository.RegisteredVehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
class FileService {
    private final S3Client s3Client;
    private final RegisteredVehicleRepository registeredVehicleRepository;
    private final RegisteredVehiclePhotoRepository registeredVehiclePhotoRepository;
    private final VehicleRegistrationCertificateRepository vehicleRegistrationCertificateRepository;

    @Value("${spring.s3.bucket}")
    private String s3Bucket;

    @Value("${spring.s3.endpoint}")
    private String s3Endpoint;

    // 사진 리스트 받아오기
    public List<RegisteredVehicleFileSummaryResponse> getRegisteredVehiclePhotos(Long userId, Long vehicleId) {
        RegisteredVehicle vehicle = registeredVehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량을 찾을 수 없음: " + vehicleId));

        // 차량이 해당 유저의 차량인지 확인
        if (!vehicle.getUsers().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 차량에 대한 권한이 없습니다.");
        }

        return registeredVehiclePhotoRepository.findByRegisteredVehicleId(vehicleId)
                .stream()
                .map(photo -> RegisteredVehicleFileSummaryResponse.from(photo, s3Endpoint))
                .toList();
    }

    // 차량 등록증 리스트 받아오기
    public List<RegisteredVehicleFileSummaryResponse> getVehicleRegistrationCertificates(Long userId, Long vehicleId) {
        RegisteredVehicle vehicle = registeredVehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량을 찾을 수 없음: " + vehicleId));

        // 차량이 해당 유저의 차량인지 확인
        if (!vehicle.getUsers().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 차량에 대한 권한이 없습니다.");
        }

        return vehicleRegistrationCertificateRepository.findByRegisteredVehicleId(vehicleId)
                .stream()
                .map(certificate -> RegisteredVehicleFileSummaryResponse.from(certificate, s3Endpoint))
                .toList();
    }

    // 차량 사진 업로드
    @Transactional
    public void uploadRegisteredVehiclePhoto(Long userId, Long vehicleId, MultipartFile file) {
        RegisteredVehicle vehicle = registeredVehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량을 찾을 수 없음: " + vehicleId));

        // 차량이 해당 유저의 차량인지 확인
        validateOwnership(vehicle, userId);

        // MultipartFile에서 파일 정보를 가져와 S3에 업로드
        String fileName = file.getOriginalFilename();
        String filePath = "vehicle/" + vehicleId + "/photo/" + UUID.randomUUID() + getFileExtension(fileName);
        String fileUrl = s3Bucket + "/" + filePath;
        String fileContentType = file.getContentType();
        Long fileSize = file.getSize();
        try {
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(s3Bucket)
                            .key(filePath)
                            .contentType(fileContentType)
                            .build(),
                    RequestBody.fromBytes(file.getBytes()));

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload vehicle photo", e);
        }

        // 차량 사진 엔티티 생성 및 저장
        RegisteredVehiclePhoto photo = new RegisteredVehiclePhoto();
        photo.setRegisteredVehicle(vehicle);
        photo.setFilePath(filePath);
        photo.setFileName(fileName);
        photo.setFileSize(fileSize);
        photo.setFileContentType(fileContentType);
        photo.setFileUrl(fileUrl);
        registeredVehiclePhotoRepository.save(photo);
    }

    // 차량 등록증 업로드
    @Transactional
    public void uploadVehicleRegistrationCertificate(Long userId, Long vehicleId, MultipartFile file) {
        RegisteredVehicle vehicle = registeredVehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량을 찾을 수 없음: " + vehicleId));

        // 차량이 해당 유저의 차량인지 확인
        validateOwnership(vehicle, userId);

        // MultipartFile에서 파일 정보를 가져와 S3에 업로드
        String fileName = file.getOriginalFilename();
        String filePath = "vehicle/" + vehicleId + "/photo/" + UUID.randomUUID() + getFileExtension(fileName);
        String fileUrl = s3Bucket + "/" + filePath;
        String fileContentType = file.getContentType();
        Long fileSize = file.getSize();
        try {
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(s3Bucket)
                            .key(filePath)
                            .contentType(fileContentType)
                            .acl("public-read")
                            .build(),
                    RequestBody.fromBytes(file.getBytes()));

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload vehicle photo", e);
        }

        // 차량 등록증 엔티티 생성 및 저장
        VehicleRegistrationCertificate certificate = new VehicleRegistrationCertificate();
        certificate.setRegisteredVehicle(vehicle);
        certificate.setFilePath(filePath);
        certificate.setFileName(fileName);
        certificate.setFileSize(fileSize);
        certificate.setFileContentType(fileContentType);
        certificate.setFileUrl(fileUrl);
        vehicleRegistrationCertificateRepository.save(certificate);
    }

    // 차량 사진 삭제
    @Transactional
    public void deleteRegisteredVehiclePhoto(Long userId, Long photoId) {
        RegisteredVehiclePhoto photo = registeredVehiclePhotoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("차량 사진을 찾을 수 없음: " + photoId));

        // 차량이 해당 유저의 차량인지 확인
        validateOwnership(photo.getRegisteredVehicle(), userId);

        // 차량 사진 엔티티 삭제
        registeredVehiclePhotoRepository.deleteByPhotoId(photoId);

        // S3에서 파일 삭제를 먼저 수행
        s3Client.deleteObject(builder -> builder.bucket(s3Bucket).key(photo.getFilePath()));
    }

    // 차량 등록증 삭제
    @Transactional
    public void deleteVehicleRegistrationCertificate(Long userId, Long certificateId) {
        VehicleRegistrationCertificate certificate = vehicleRegistrationCertificateRepository.findById(certificateId)
                .orElseThrow(() -> new IllegalArgumentException("차량 등록증을 찾을 수 없음: " + certificateId));

        // 차량이 해당 유저의 차량인지 확인
        validateOwnership(certificate.getRegisteredVehicle(), userId);

        // 차량 등록증 엔티티 삭제
        vehicleRegistrationCertificateRepository.deleteByCertificateId(certificateId);

        // S3에서 파일 삭제
        s3Client.deleteObject(builder -> builder.bucket(s3Bucket).key(certificate.getFilePath()));
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private void validateOwnership(RegisteredVehicle vehicle, Long userId) {
        if (!vehicle.getUsers().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 차량에 대한 권한이 없습니다.");
        }
    }
}
