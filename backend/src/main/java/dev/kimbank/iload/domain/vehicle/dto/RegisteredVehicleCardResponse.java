package dev.kimbank.iload.domain.vehicle.dto;

import dev.kimbank.iload.domain.vehicle.entity.enums.*;
import dev.kimbank.iload.domain.file.entity.RegisteredVehiclePhoto;
import jakarta.annotation.Nullable;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

/**
 * DTO for {@link dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle}
 */
@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
public class RegisteredVehicleCardResponse implements Serializable {
    Long id;
    Long usersId;
    String username;
    ManufacturerEnum manufacturer;
    Integer releaseYear;
    Integer mileage;
    Integer price;
    @Nullable
    String thumbnailUrl;
    Instant createdAt;
    Instant updatedAt;

    public static RegisteredVehicleCardResponse from(RegisteredVehicleCardResponse cardResponse, String s3Endpoint) {
        return new RegisteredVehicleCardResponse(
                cardResponse.getId(),
                cardResponse.getUsersId(),
                cardResponse.getUsername(),
                cardResponse.getManufacturer(),
                cardResponse.getReleaseYear(),
                cardResponse.getMileage(),
                cardResponse.getPrice(),
                cardResponse.getThumbnailUrl() != null ?
                        s3Endpoint + "/" + cardResponse.getThumbnailUrl() :
                        null,
                cardResponse.getCreatedAt(),
                cardResponse.getUpdatedAt()
        );
    }
}
