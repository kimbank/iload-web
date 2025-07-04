package dev.kimbank.iload.domain.vehicle.dto;

import dev.kimbank.iload.domain.vehicle.entity.enums.*;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle}
 */
@Value
public class VehicleRegistrationEtcInfoRequest implements Serializable {
    Long usersId;
    DriveTypeEnum driveType;
    TransmissionEnum transmission;
    ColorEnum color;
    LocalDateTime initialRegistrationDate;
    SpecialUseHistoryEnum specialUseHistory;
    SpecialModificationHistoryEnum specialModificationHistory;
    OptionInfoEnum optionInfo;
}