package dev.kimbank.iload.domain.vehicle.dto;

import dev.kimbank.iload.domain.vehicle.entity.enums.*;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle}
 */
@Value
public class VehicleRegistrationEtcInfoRequest implements Serializable {
    DriveTypeEnum driveType;
    TransmissionEnum transmission;
    ColorEnum color;
    LocalDate initialRegistrationDate;
    SpecialUseHistoryEnum specialUseHistory;
    SpecialModificationHistoryEnum specialModificationHistory;
    OptionInfoEnum optionInfo;
}