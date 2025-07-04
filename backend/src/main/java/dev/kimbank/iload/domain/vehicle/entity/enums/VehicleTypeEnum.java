package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum VehicleTypeEnum {
    CAR("CAR", "자동차"),
    TRUCK("TRUCK", "트럭"),
    BUS("BUS", "버스"),
    MOTORCYCLE("MOTORCYCLE", "오토바이"),
    OTHER("OTHER", "기타");

    private final String code;
    private final String description;
}
