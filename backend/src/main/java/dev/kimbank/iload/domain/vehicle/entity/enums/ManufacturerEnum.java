package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ManufacturerEnum {
    // 기아
    KIA("KIA", "기아"),
    // 현대
    HYUNDAI("HYUNDAI", "현대"),
    // 제네시스
    GENESIS("GENESIS", "제네시스"),
    // 쉐보레
    CHEVROLET("CHEVROLET", "쉐보레"),
    // 르노코리아
    RENAULT_KOREA("RENAULT_KOREA", "르노코리아"),
    // KG 모빌리티
    KG_MOBILITY("KG_MOBILITY", "KG 모빌리티"),
    // 기타
    OTHER("OTHER", "기타");

    private final String code;
    private final String description;
}
