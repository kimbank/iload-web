package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SpecialUseHistoryEnum {
    // 대여 용도
    RENTAL("RENTAL", "대여 용도"),
    // 영업 용도
    COMMERCIAL("COMMERCIAL", "영업 용도"),
    // 관용 용도
    OFFICIAL("OFFICIAL", "관용 용도"),
    // 기타
    OTHER("OTHER", "기타");

    private final String code;
    private final String description;
}
