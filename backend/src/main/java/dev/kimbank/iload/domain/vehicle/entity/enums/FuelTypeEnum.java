package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FuelTypeEnum {
    DIESEL("DIESEL", "경유"),
    GASOLINE("GASOLINE", "휘발유"),
    LPG("LPG", "LPG"),
    ELECTRIC("ELECTRIC", "전기"),
    HYBRID("HYBRID", "하이브리드"),
    OTHER("OTHER", "기타");

    private final String code;
    private final String description;
}
