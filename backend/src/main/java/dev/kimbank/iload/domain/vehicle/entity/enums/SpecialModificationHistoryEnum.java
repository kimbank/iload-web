package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SpecialModificationHistoryEnum {
    // 연료 개조
    FUEL_MODIFICATION("FUEL_MODIFICATION", "연료 개조"),
    // 좌석 개조
    SEAT_MODIFICATION("SEAT_MODIFICATION", "좌석 개조"),
    // 엔진 개조
    ENGINE_MODIFICATION("ENGINE_MODIFICATION", "엔진 개조"),
    // 기타
    OTHER("OTHER", "기타");


    private final String code;
    private final String description;
}
