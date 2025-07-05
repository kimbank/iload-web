package dev.kimbank.iload.domain.vehicle.dto;

import dev.kimbank.iload.domain.vehicle.entity.enums.*;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;

/**
 * DTO for {@link dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle}
 */
@Value
@NoArgsConstructor(force = true)
public class VehicleRegistrationAllInfoResponse implements Serializable {
    Long usersId;
    VehicleTypeEnum vehicleType;
    Integer displacement;
    Integer seaterCount;
    FuelTypeEnum fuelType;
    String vehicleCode;
    String vehicleNumber;
    ManufactureCountryEnum manufactureCountry;
    String vehicleGrade;
    Integer releasePrice;
    Integer mileage;
    Integer releaseYear;
    Integer manufactureYear;
    AccidentInfoEnum accidentInfo;
    RepaintedEnum repainted;

    DriveTypeEnum driveType;
    TransmissionEnum transmission;
    ColorEnum color;
    LocalDate initialRegistrationDate;
    SpecialUseHistoryEnum specialUseHistory;
    SpecialModificationHistoryEnum specialModificationHistory;
    OptionInfoEnum optionInfo;

    Instant createdAt;
    Instant updatedAt;
}