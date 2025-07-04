package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RepaintedEnum {
    NOT_REPAINTED("NOT_REPAINTED", "무도색"),
    // 단순도색
    REPAINTED_WITH_SIMPLE("REPAINTED_WITH_SIMPLE", "단순도색"),
    // 판금도색
    REPAINTED_WITH_BODYWORK("REPAINTED_WITH_BODYWORK", "판금도색"),
    // 복원도색
    REPAINTED_WITH_RESTORATION("REPAINTED_WITH_RESTORATION", "복원도색"),
    // 기타
    OTHER("OTHER", "기타");


    private final String code;
    private final String description;
}
