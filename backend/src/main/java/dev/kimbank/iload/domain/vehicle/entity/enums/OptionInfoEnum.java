package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum OptionInfoEnum {
    // 썬루프
    SUNROOF("SUNROOF", "썬루프"),
    // 사이드스탭
    SIDE_STEP("SIDE_STEP", "사이드스탭"),
    // 스마트키
    SMART_KEY("SMART_KEY", "스마트키"),
    // 기타
    OTHER("OTHER", "기타");

    private final String code;
    private final String description;
}
