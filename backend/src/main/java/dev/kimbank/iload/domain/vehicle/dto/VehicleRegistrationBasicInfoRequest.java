package dev.kimbank.iload.domain.vehicle.dto;

import dev.kimbank.iload.domain.vehicle.entity.enums.*;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle}
 */
@Value
public class VehicleRegistrationBasicInfoRequest implements Serializable {
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
}
