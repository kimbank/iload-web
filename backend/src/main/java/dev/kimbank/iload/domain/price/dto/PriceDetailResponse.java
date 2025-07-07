package dev.kimbank.iload.domain.price.dto;

import dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle;
import dev.kimbank.iload.domain.vehicle.entity.enums.*;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
public class PriceDetailResponse {
    Long id;
    ManufacturerEnum manufacturer;
    VehicleTypeEnum vehicleType;
    FuelTypeEnum fuelType;
    Integer mileage;
    Integer releaseYear;
    Integer manufactureYear;
    Set<AccidentInfoEnum> accidentInfo;
    RepaintedEnum repainted;
    ColorEnum color;
    List<String> photos;
    Instant createdAt;
    Instant updatedAt;

    public static PriceDetailResponse from(RegisteredVehicle vehicle, String s3Endpoint) {
        return PriceDetailResponse.builder()
                .id(vehicle.getId())
                .manufacturer(vehicle.getManufacturer())
                .vehicleType(vehicle.getVehicleType())
                .fuelType(vehicle.getFuelType())
                .mileage(vehicle.getMileage())
                .releaseYear(vehicle.getReleaseYear())
                .manufactureYear(vehicle.getManufactureYear())
                .accidentInfo(vehicle.getAccidentInfo())
                .repainted(vehicle.getRepainted())
                .color(vehicle.getColor())
                .photos(vehicle.getRegisteredVehiclePhotos()
                        .stream()
                        .map(photo -> s3Endpoint + "/" + photo.getFileUrl())
                        .toList())
                .createdAt(vehicle.getCreatedAt())
                .updatedAt(vehicle.getUpdatedAt())
                .build();

    }
}