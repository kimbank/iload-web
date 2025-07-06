package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AccidentInfoEnum {
    // 사고 없음
    NONE("NONE", "사고 없음"),
    // 전손 보험사고
    TOTAL_LOSS("TOTAL_LOSS", "전손 보험사고"),
    // 침수 보험사고
    SUBMERGED("SUBMERGED", "침수 보험사고"),
    // 도난 보험사고
    STOLEN("STOLEN", "도난 보험사고"),
    // 기타 보험사고
    OTHER("OTHER", "기타");

    private final String code;
    private final String description;
}
