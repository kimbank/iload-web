package dev.kimbank.iload.domain.vehicle.dto;

import dev.kimbank.iload.domain.vehicle.entity.enums.*;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for {@link dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle}
 */
@Value
public class RegisteredVehicleCardResponse implements Serializable {
    Long id;
    Long usersId;
    String username;
    ManufacturerEnum manufacturer;
    Integer releaseYear;
    Integer mileage;
    Integer price;
    List<RegisteredVehiclePhotoDto> photos;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    /**
     * DTO for {@link dev.kimbank.iload.domain.vehicle.entity.RegisteredVehiclePhoto}
     */
    @Value
    public static class RegisteredVehiclePhotoDto implements Serializable {
        String url;
    }
}