package dev.kimbank.iload.domain.file.dto;

import dev.kimbank.iload.domain.file.entity.RegisteredVehiclePhoto;
import dev.kimbank.iload.domain.file.entity.VehicleRegistrationCertificate;
import dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle;
import lombok.*;

import java.time.Instant;

/**
 * DTO for {@link dev.kimbank.iload.domain.file.entity.RegisteredVehiclePhoto}
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class RegisteredVehicleFileSummaryResponse {
    Long id;
    Long registeredVehicleId;
    String filePath;
    String fileName;
    String fileUrl;
    Long fileSize;
    Instant createdAt;
    Instant updatedAt;

    public static RegisteredVehicleFileSummaryResponse from(RegisteredVehiclePhoto photo, String s3Endpoint) {
        return RegisteredVehicleFileSummaryResponse.builder()
                .id(photo.getId())
                .registeredVehicleId(photo.getRegisteredVehicle().getId())
                .filePath(photo.getFilePath())
                .fileName(photo.getFileName())
                .fileUrl(s3Endpoint + "/" + photo.getFileUrl())
                .fileSize(photo.getFileSize())
                .createdAt(photo.getCreatedAt())
                .updatedAt(photo.getUpdatedAt())
                .build();
    }
    public static RegisteredVehicleFileSummaryResponse from(VehicleRegistrationCertificate photo, String s3Endpoint) {
        return RegisteredVehicleFileSummaryResponse.builder()
                .id(photo.getId())
                .registeredVehicleId(photo.getRegisteredVehicle().getId())
                .filePath(photo.getFilePath())
                .fileName(photo.getFileName())
                .fileUrl(s3Endpoint + "/" + photo.getFileUrl())
                .fileSize(photo.getFileSize())
                .createdAt(photo.getCreatedAt())
                .updatedAt(photo.getUpdatedAt())
                .build();
    }
}
