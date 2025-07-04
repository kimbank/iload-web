package dev.kimbank.iload.domain.vehicle.dto;

import dev.kimbank.iload.domain.vehicle.entity.enums.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle}
 */
@Setter
@Getter
@RequiredArgsConstructor
@AllArgsConstructor
public class RegisterVehicleInProgressCardResponse implements Serializable {
    Long id;
    Long usersId;
    String username;
    Integer progressStep;
    Integer progressTotalSteps;
    ManufacturerEnum manufacturer;
    Integer releaseYear;
    Integer mileage;
    Integer price;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}