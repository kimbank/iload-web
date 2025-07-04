package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TransmissionEnum {
    // 자동 변속기
    AUTOMATIC("AUTOMATIC", "A/T"),
    // 수동 변속기
    MANUAL("MANUAL", "M/T"),
    // 기타
    OTHER("OTHER", "기타");

    private final String code;
    private final String description;
}
